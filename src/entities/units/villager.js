import Phaser from "phaser";
import Movement from "../../behaviours/movement.js";
import Fighting from "../../behaviours/fighting.js";
import HealthBar from "../../components/health-bar.js";
import WalkToDestinationCommand from "./commands/walk-to-destination.js";
import GatherResourceCommand from "./commands/gather-resource.js";
import AtttackEntityCommand from "./commands/attack-entity.js";
import BuildBuildingCommand from "./commands/build-building.js";

export default class Villager extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, townCenter, name) {
    // Circle
    super(scene, x, y, Math.random() > 0.5 ? "boy" : "girl");
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setCircle(5);
    this.setFrictionAir(0.5);

    // Properties
    this.selected = false;
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
    this.command = null;
    this.team = "blue";
    this.attackDamage = 5;
    this.attackPeriodInSeconds = 1;

    // Subparts
    this.healthBar = new HealthBar(this.scene, this);
    if (name != null) {
      this.nameTag = this.scene.add.text(x, y, name, {
        fontFamily: "Arial Black",
        fontStyle: "bold",
        color: "#000",
        fontSize: 8,
      });
      this.nameTag.setStroke("#de77ae", 2);
      //  Apply the shadow to neither stroke nor fill, if you don't need a shadow then don't call setShadow at all :)
      this.nameTag.setShadow(1, 1, "#333333", 2, false, false);
      this.nameTag.setResolution(10);
      this.nameTag.setAlpha(0.8);
      this.nameTag.setDepth(100);
    }

    // Behaviours
    this.movement = new Movement(this.scene);
    this.fighting = new Fighting(this.movement);

    // Input Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      this.scene.villagers.forEach((v) => v.unselect());
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
    if (this.nameTag != null) {
      this.nameTag.x = this.x - this.nameTag.width / 2;
      this.nameTag.y = this.y + this.nameTag.height;
    }
    if (this.command != null) {
      let done = this.command.update();
      if (done) {
        this.command = null;
      }
    }

    // Update subparts
    this.healthBar.update();
  }

  // Private functions

  _setStatus(newStatus) {
    // TODO Deprecated? We are now relying on the Commands
    this.status = newStatus;
  }

  _onEnemyDied(enemy) {
    // TODO Deprecated? We are checking the health in the AttackEntityCommand class.
  }

  _onDie() {
    this.unselect(); // We call unselect just in case it was selected
    // Remove all listeners
    this.events.off("enemy-died", this._onEnemyDied, this);
    // Emit the died event
    this.events.emit("villager-died", this); // remo
    // Destroy subparts
    this.healthBar.destroy();
    if (this.nameTag) {
      this.nameTag.destroy();
    }

    this.destroy();
  }

  // Public functions

  select() {
    this.unselect(); // TODO We must ensure that we do not trigger new event listeners on every selection, so we first unselect as a workaround until new Events Management
    //this.setStrokeStyle(1, "0xFF0000");
    this.setTint("0xFFBBBB");
    this.selected = true;
    // Emit events
    this.events.emit("new-villager-selected", this);
    // Start listening for events
    this.events.once(
      "resource-right-clicked",
      this.startCollectingResource,
      this
    );
    this.events.once(
      "building-in-progress-right-clicked",
      this.startBuilding,
      this
    );
    this.events.once("map-left-or-middle-clicked", this.unselect, this);
    this.events.on("map-right-clicked", this.moveToCameraPointer, this);
    this.events.once("new-building-selected", this.unselect, this);
    this.events.once("enemy-right-clicked", this.attackEnemy, this);
  }

  unselect() {
    this.clearTint();
    this.selected = false;
    // Emit events
    this.events.emit("villager-unselected", this);
    // Stop listening for events
    this.events.off(
      "resource-right-clicked",
      this.startCollectingResource,
      this
    );
    this.events.off(
      "building-in-progress-right-clicked",
      this.startBuilding,
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
    this.command = new WalkToDestinationCommand(this, position);
  }

  startCollectingResource(resource) {
    this.command = new GatherResourceCommand(this, resource);
    this.unselect();
  }

  startBuilding(building) {
    this.command = new BuildBuildingCommand(this, building);
    this.unselect();
  }

  hit(attacker, damage) {
    // In case we are attacked: abort what we were doing and defend outselves.
    if (
      this.command === null ||
      !(this.command instanceof AtttackEntityCommand)
    ) {
      this.command = new AtttackEntityCommand(this, attacker);
    }
    // Process damage
    // TODO Move this to AttackEntityCommand ?
    this.health -= damage;
    if (this.health <= 0) {
      this._onDie();
      return true;
    }
    return false;
  }

  attackEnemy(enemy) {
    // :info: Do not run the same AttackEntity again because it will produce a new hit when it shouldnt.
    // Consider that the entity could change and the attacker should be allowed to exceed the tps limit.
    if (
      this.command == null ||
      (this.command instanceof AtttackEntityCommand &&
        this.command.attackedEntity !== enemy)
    ) {
      this.command = new AtttackEntityCommand(this, enemy);
    }
  }
}
