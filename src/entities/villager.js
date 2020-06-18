import Phaser from "phaser";
import Movement from "../behaviours/movement.js";
import Fighting from "../behaviours/fighting.js";
import HealthBar from "../components/health-bar.js";

//export default class Villager extends Phaser.GameObjects.Arc {
export default class Villager extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, townCenter) {
    // Circle
    super(scene, x, y, Math.random() > 0.5 ? "boy" : "girl");
    //super(scene, x, y, 5, 0, 180, false, "0x0000FF", 1);
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setCircle(5);
    this.setFrictionAir(0.5);

    // Properties
    this.selected = false;
    this.closestDeposit = townCenter; // TODO Calculate this somewhere else
    this.resourceGatheringSpeed = 0.5; // Units per second
    this.latestGatheringTime = 0;
    this.target = null;
    this.status = "idle";
    this.bagpack = {
      maxCapacity: 10,
      amount: 0,
    };
    this.initialHealth = 100;
    this.health = 100;
    this.events = scene.events;
    this.scene = scene;

    // Subparts
    this.healthBar = new HealthBar(this.scene, this);

    // Behaviours
    this.movement = new Movement(this.scene);
    this.fighting = new Fighting(this.movement);

    // Input Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (this.selected) {
        this.unselect();
      } else {
        this.select();
      }
      event.stopPropagation();
    });

    // Listen for enemies dying
    this.events.on("enemy-died", this._onEnemyDied, this);
  }

  update() {
    // Movement
    if (this.status == "walking-to-destination") {
      // TODO Remove this margin from here. Move it to movement.js and think on a solution for "getting as closest as possible to a building"
      this.movement.moveTo(this, this.target, () => {
        this.target = null;
        this._setStatus("idle");
      });

      // Collecting
    } else if (this.status == "collecting") {
      // Note: Here target must be Resource

      // If villager is not full, keeps collecting
      if (
        this.bagpack.amount < this.bagpack.maxCapacity &&
        this.target.amount > 0
      ) {
        this.movement.moveTo(this, this.target, () => {
          // Stop movement
          this.setVelocity(0);
          // Collect resource
          let nowTime = new Date().getTime() / 1000;
          let timeSinceLatestGather = nowTime - this.latestGatheringTime;
          if (timeSinceLatestGather >= 1 / this.resourceGatheringSpeed) {
            var amountConsumed = this.target.consume(1); // Consuming unit by unit
            this.bagpack.amount += amountConsumed;
            if (amountConsumed < 1) {
              this.target = null; // TODO Calculate next resource
            }
            this.latestGatheringTime = nowTime;
          }
        });
      } else {
        // Villager is at full capacity

        this.movement.moveTo(this, this.closestDeposit, () => {
          this.setVelocity(0);
          // Unload
          // TODO Make it take some time. ⚠️  If logic is not modified after unloading a little of the resource, the villager will go back to resource mine.
          this.closestDeposit.deposit(this.bagpack.amount);
          this.bagpack.amount = 0;
        });

        if (this.bagpack.amount == 0 && this.target.amount == 0) {
          this.moveToPosition(this.closestDeposit.getNewVillagerPosition());
        }
      }
    } else if (this.status == "attacking") {
      this.fighting.moveIntoAttackRangeAndAttack(this, this.target, 5, 1);
    } else if (this.status == "looking-for-enemy") {
      let closestEnemy = this.fighting.getClosestEntity(
        this,
        this.scene.enemies
      );
      if (closestEnemy != null) {
        this.target = closestEnemy;
        this._setStatus("attacking");
      } else {
        this._setStatus("idle");
      }
    }

    // Update subparts
    this.healthBar.update();
  }

  // Private functions

  _setStatus(newStatus) {
    if (newStatus == "collecting") {
      this.latestGatheringTime = Math.floor(new Date().getTime() / 1000);
    }
    this.status = newStatus;
  }

  _onEnemyDied(enemy) {
    if (this.target == enemy) {
      this.target = null;
      this._setStatus("looking-for-enemy");
    }
  }

  _onDie() {
    this.unselect(); // We call unselect just in case it was selected
    // Remove all listeners
    this.events.off("enemy-died", this._onEnemyDied, this);
    // Emit the died event
    this.events.emit("villager-died", this); // remo
    // Destroy subparts
    this.healthBar.destroy();

    this.destroy();
  }

  // Public functions

  select() {
    this.unselect(); // TODO We must ensure that we do not trigger new event listeners on every selection, so we first unselect as a workaround until new Events Management
    //this.setStrokeStyle(1, "0xFF0000");
    this.setTint("0xFFBBBB");
    this.selected = true;
    // Emit events
    this.events.emit("new-villager-selected");
    // Start listening for events
    this.events.once(
      "resource-right-clicked",
      this.startCollectingResource,
      this
    );
    this.events.once("map-left-or-middle-clicked", this.unselect, this);
    this.events.on("map-right-clicked", this.moveToCameraPointer, this);
    this.events.once("new-building-selected", this.unselect, this);
    this.events.once("enemy-right-clicked", this.attackEnemy, this);
    console.log(this);
  }

  unselect() {
    //this.setStrokeStyle(0);
    this.clearTint();
    this.selected = false;
    // Stop listening for events
    this.events.off(
      "resource-right-clicked",
      this.startCollectingResource,
      this
    );
    this.events.off("map-left-or-middle-clicked", this.unselect, this);
    this.events.off("map-right-clicked", this.moveToCameraPointer, this);
    this.events.off("new-building-selected", this.unselect, this);
    this.events.off("enemy-right-clicked", this.attackEnemy, this);
  }

  moveToCameraPointer(pointer) {
    this.moveToPosition({ x: pointer.worldX, y: pointer.worldY });
  }

  moveToPosition(position) {
    this.target = new Phaser.Math.Vector2(position);
    this._setStatus("walking-to-destination");
  }

  startCollectingResource(resource) {
    this._setStatus("collecting");
    this.target = resource;
    this.unselect();
  }

  hit(attacker, damage) {
    // In case we are attacked: abort what we were doing and target first attacker.
    if (this.status != "attacking") {
      this._setStatus("attacking");
      if (attacker != this.target) {
        this.target = attacker;
      }
    }
    // Process damage
    this.health -= damage;
    if (this.health < 0) {
      this._onDie();
      return true;
    }
    return false;
  }

  attackEnemy(enemy) {
    this._setStatus("attacking");
    this.target = enemy;
  }
}
