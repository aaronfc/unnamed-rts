import Phaser from "phaser";
import Movement from './movement.js'
import Fighting from './fighting.js'

export default class Enemy extends Phaser.GameObjects.Arc {

  constructor(scene, x, y) {
    // Circle
    super(scene, x, y, 5, 0, 360, false, "0xFF0000", 1);
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setCircle(5);

    // Properties
    this.selected = false;
    this.target = null;
    this.status = 'looking-for-victim';
    this.latestAttackTime = 0;
    this.events = scene.events;
    this.scene = scene;
    this.health = 100;

    // Behaviours
    this.movement = new Movement(); // TODO Do not instantiate one of this for every enemy
    this.fighting = new Fighting(this.movement);

    // Input Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        if (this.selected) {
          this.unselect();
        } else {
          this.select();
        }
      } else if (pointer.rightButtonDown()) {
        this.events.emit('enemy-right-clicked', this);
      }
      event.stopPropagation();
    });

    // Listen events
    this.events.on('villager-died', this._onVictimDied, this);
  }

  update() {
    if (this.status == "looking-for-victim") {
      let closestVictim = this.fighting.getClosestEntity(this, this.scene.villagers);
      if (closestVictim != null) {
        this.target = closestVictim;
        this._setStatus("attacking");
      }
    } else if (this.status == "attacking") {
      this.fighting.moveIntoAttackRangeAndAttack(this, this.target, 10, 1);
    }
  }

  // Private functions
  

  _setStatus(newStatus) {
    this.status = newStatus;
  }

  _onVictimDied(villager) {
    if (this.target == villager) {
      this.target = null;
      this._setStatus("looking-for-victim");
    }
  }

  // Public functions

  select() {
    this.setStrokeStyle(1, "0x0000FF");
    this.selected = true;
    // Emit events
    this.events.emit('new-enemy-selected');
    // Start listening for events
    this.events.once('map-left-or-middle-clicked', this.unselect, this);
    this.events.on('map-right-clicked', this.moveToPosition, this);
    this.events.once('new-building-selected', this.unselect, this);
    this.events.once('new-villager-selected', this.unselect, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    // Stop listening for events
    this.events.off('map-left-or-middle-clicked', this.unselect, this);
    this.events.off('map-right-clicked', this.moveToPosition, this);
    this.events.off('new-building-selected', this.unselect, this);
    this.events.off('new-villager-selected', this.unselect, this);
  }

  hit(attacker, damage) {
    // In case we are attacked: abort what we were doing and target first attacker.
    if (this.status != 'attacking') {
      this._setStatus('attacking');
      if (attacker != this.target) {
        this.target = attacker;
      }
    }
    // Process damage
    this.health -= damage;
    if (this.health < 0) {
      this.events.emit('enemy-died', this);
      this.events.off('villager-died', this._onVictimDied, this);
      this.destroy();
      return true;
    }
    return false;
  }
}
