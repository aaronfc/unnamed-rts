import Phaser from "phaser";
import Movement from "../../behaviours/movement.js";
import Fighting from "../../behaviours/fighting.js";
import HealthBar from "../../components/health-bar.js";
import AtttackEntityCommand from "./commands/attack-entity.js";

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
    this.command = null;
    this.team = "ai";
    this.attackDamage = 10;
    this.attackPeriodInSeconds = 1;

    // Behaviours
    this.movement = new Movement(this.scene);
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
    if (this.health <= 0) {
      this._onDie();
      return true;
    }
    return false;
  }

  attack(entity) {
    // :info: Do not run the same AttackEntity again because it will produce a new hit when it shouldnt.
    // Consider that the entity could change and the attacker should be allowed to exceed the tps limit.
    if (
      this.command == null ||
      (this.command instanceof AtttackEntityCommand &&
        this.command.attackedEntity !== entity)
    ) {
      this.command = new AtttackEntityCommand(this, entity);
    }
  }
}
