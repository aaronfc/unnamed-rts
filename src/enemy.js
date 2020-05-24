import Phaser from "phaser";
import Movement from "./movement.js";
import Fighting from "./fighting.js";
import HealthBar from "./health-bar.js";

export default class Enemy extends Phaser.GameObjects.Arc {
  constructor(scene, position) {
    // Circle
    super(scene, position.x, position.y, 5, 0, 360, false, "0xFF0000", 1);
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setCircle(5);
    this.setFrictionAir(0.5); // High friction (not moving)

    // Properties
    this.selected = false;
    this.target = null;
    this.status = "attacking";
    this.latestAttackTime = 0;
    this.events = scene.events;
    this.scene = scene;
    this.initialHealth = 100;
    this.health = 100;

    // Behaviours
    this.movement = new Movement(); // TODO Do not instantiate one of this for every enemy
    this.fighting = new Fighting(this.movement);

    // Subparts
    this.healthBar = new HealthBar(this.scene, this);

    // Input Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        if (this.selected) {
          this.unselect();
        } else {
          this.select();
        }
      } else if (pointer.rightButtonDown()) {
        this.events.emit("enemy-right-clicked", this);
      }
      event.stopPropagation();
    });

    // Listen events
    this.events.on("villager-died", this._onVictimDied, this);
  }

  update() {
    if (this.status == "attacking") {
      let closestVictim = this.fighting.getClosestEntity(
        this,
        this.scene.villagers
      ); // TODO ⚠️  Non-optimal approach. We are calculating the closest enemy for every tick of the game!
      if (closestVictim != this.target) {
        this.target = closestVictim;
      }
      if (this.target != null) {
        this.fighting.moveIntoAttackRangeAndAttack(this, this.target, 10, 1);
      } else {
        this.setVelocity(0, 0);
        this.setFrictionAir(0.5); // High friction (not moving)
      }
    }

    // Update subparts
    this.healthBar.update();
  }

  // Private functions

  _setStatus(newStatus) {
    this.status = newStatus;
  }

  _onVictimDied(villager) {
    if (this.target == villager) {
      this.target = null;
    }
  }

  _onDie() {
    this.unselect(); // Call unselect just in case it was selected
    // Remove listeners
    this.events.off("villager-died", this._onVictimDied, this);
    // Emit died event
    this.events.emit("enemy-died", this);
    // Destroy subparts
    this.healthBar.destroy();

    this.destroy();
  }

  // Public functions

  select() {
    this.setStrokeStyle(1, "0x0000FF");
    this.selected = true;
    // Emit events
    this.events.emit("new-enemy-selected");
    // Start listening for events
    this.events.once("map-left-or-middle-clicked", this.unselect, this);
    this.events.once("new-building-selected", this.unselect, this);
    this.events.once("new-villager-selected", this.unselect, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    // Stop listening for events
    this.events.off("map-left-or-middle-clicked", this.unselect, this);
    this.events.off("new-building-selected", this.unselect, this);
    this.events.off("new-villager-selected", this.unselect, this);
  }

  hit(attacker, damage) {
    // Process damage
    this.health -= damage;
    if (this.health < 0) {
      this._onDie();
      return true;
    }
    return false;
  }
}
