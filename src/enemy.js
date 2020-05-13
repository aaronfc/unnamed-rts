import Phaser from "phaser";
import Movement from './movement.js'

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

    // Behaviours
    this.movement = new Movement(); // TODO Do not instantiate one of this for every enemy

    // Input Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      if (this.selected) {
        this.unselect();
      } else {
        this.select();
      }
      event.stopPropagation();
    });

    // Listen events
    this.events.on('villager-died', (villager) => {
      if (this.target == villager) {
        this.target = null;
        this._setStatus("looking-for-victim");
      }
    });
  }

  update() {
    if (this.status == "looking-for-victim") {
      let closestVictim = this._getClosestVictim(this.scene.villagers);
      if (closestVictim != null) {
        this.target = closestVictim;
        this._setStatus("attacking");
      }
    } else if (this.status == "attacking") {
      this.movement.moveTo(this, this.target, () => {
        let now = Math.floor(new Date()/1000);
        if (now - this.latestAttackTime >= 1) {
          this.target.hit(10);
          this.latestAttackTime = now;
        }
      });
    }
  }

  // Private functions
  
  _getClosestVictim(villagers) {
    if (villagers.length > 0) {
      let closestVictim = villagers[0];
      let closestVictimDistance = Infinity;
      for (var i=1; i<villagers.length; i++) {
        let villager = villagers[i];
        let distance = Phaser.Math.Distance.BetweenPoints(this, villager);
        if (distance < closestVictimDistance) {
          closestVictim = villager;
          closestVictimDistance = distance;
        }
      }
      return closestVictim;
    }
    return null;
  }

  _setStatus(newStatus) {
    this.status = newStatus;
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
}
