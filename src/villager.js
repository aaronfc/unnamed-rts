import Phaser from "phaser";

export default class Villager extends Phaser.GameObjects.Arc {

  constructor(scene, x, y, townCenter) {
    // Circle
    super(scene, x, y, 5, 0, 360, false, "0x0000FF", 1);
    scene.add.existing(this);
    scene.physics.add.existing(this, 0);
    this.body.setCollideWorldBounds(true);

    // Properties
    this.selected = false;
    this.destination = new Phaser.Math.Vector2(x, y);
    this.closestDeposit = townCenter; // TODO Calculate this somewhere else
    this.target = null;
    this.status = 'idle';
    this.bagpack = {
      maxCapacity: 300,
      amount: 0
    }
    this.events = scene.events;
    this.scene = scene;

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
  }

  update() {

    // Movement
    if (this.status == "walking-to-destination") {

      if (this._isAsClosestAsPossibleTo(this.destination, 1, 1)) {
        this.body.setVelocity(0, 0);
        this.destination = null;
        this.status = 'idle';
      } else {
        this._moveCloserTo(this.destination.x, this.destination.y);
      }

    }

    // Collection
    if (this.status == "collecting") {
      
      // If villager is not full it he collects
      if (this.bagpack.amount < this.bagpack.maxCapacity) {

        if (this._isAsClosestAsPossibleTo(this.target, this.target.width/2 + this.width/2, this.target.height/2 + this.height/2)) {
          this.body.setVelocity(0, 0);
          // TODO Discount amount from resource
          // Collect
          this.bagpack.amount += 1;
        } else {
          // Note: Here target must be Resource
          this._moveCloserTo(this.target.x, this.target.y);
        }

      } else { // Villager is at full capacity

        if (this._isAsClosestAsPossibleTo(this.closestDeposit, this.closestDeposit.width/2 + this.width/2, this.closestDeposit.height/2 + this.height/2)) {
          this.body.setVelocity(0, 0);
          // Unload
          // TODO Make it take some time. ⚠️  If logic is not modified after unloading a little of the resource, the villager will go back to resource mine.
          this.bagpack.amount = 0;
        } else {
          // Note: Here target must be Resource
          this._moveCloserTo(this.closestDeposit.x, this.closestDeposit.y);
        }

      }
    }
  }

  // Private functions
  
  _moveCloserTo(x, y) {
    this.scene.physics.moveTo(this, x, y, 50);
  }

  _isAsClosestAsPossibleTo(destination, marginX, marginY) {
      var villagerDistanceToDestinationX = Math.abs(destination.x - this.x);
      var villagerDistanceToDestinationY = Math.abs(destination.y - this.y);
      return villagerDistanceToDestinationX <= marginX && villagerDistanceToDestinationY <= marginY;
  }

  // Public functions

  select() {
    this.setStrokeStyle(1, "0xFF0000");
    this.selected = true;
    // Start listening for commands
    this.events.once('resource-right-clicked', this.startCollectingResource, this);
    this.events.once('map-right-clicked', this.moveToPosition, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    // Stop listening for commands
    this.events.off('resource-right-clicked', this.startCollectingResource, this);
    this.events.off('map-right-clicked', this.moveToPosition, this);
  }

  moveToPosition(position) {
    this.destination = new Phaser.Math.Vector2(position.x, position.y);
    this.status = 'walking-to-destination';
    this.target = null;
    this.unselect();
  }

  startCollectingResource(resource) {
    this.destination = null;
    this.status = 'collecting';
    this.target = resource;
    this.unselect();
  }
}
