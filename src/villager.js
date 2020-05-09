import Phaser from "phaser";

export default class Villager extends Phaser.GameObjects.Arc {

  constructor(scene, x, y, townCenter) {
    // Circle
    super(scene, x, y, 5, 0, 360, false, "0x0000FF", 1);
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setCircle(5);

    // Properties
    this.selected = false;
    this.destination = new Phaser.Math.Vector2(x, y);
    this.closestDeposit = townCenter; // TODO Calculate this somewhere else
    this.gatherCapacity = 1;
    this.target = null;
    this.status = 'idle';
    this.bagpack = {
      maxCapacity: 10,
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
      if (this._isAsClosestAsPossibleTo(this.destination, 2, 2)) {
        this.setVelocity(0);
        this.destination = null;
        this.status = 'idle';
      } else {
        this._moveCloserTo(this.destination.x, this.destination.y);
      }

    }

    // Collection
    if (this.status == "collecting") {
      
      // Note: Here target must be Resource
      
      // If villager is not full it he collects
      if (this.bagpack.amount < this.bagpack.maxCapacity && this.target.amount > 0) {

        if (this._isAsClosestAsPossibleTo(this.target, this.target.width/2 + this.width/2 + 2, this.target.height/2 + this.height/2 + 2)) {
          // Stop movement
          this.setVelocity(0);
          // Collect resource
          var amountConsumed = this.target.consume(this.gatherCapacity);
          this.bagpack.amount += amountConsumed;
          if (amountConsumed < this.gatherCapacity) {
            this.target = null; // TODO Calculate next resource
          }
        } else {
          this._moveCloserTo(this.target.x, this.target.y);
        }

      } else { // Villager is at full capacity

        if (this._isAsClosestAsPossibleTo(this.closestDeposit, this.closestDeposit.width/2 + this.width/2 + 2, this.closestDeposit.height/2 + this.height/2 + 2)) {
          this.setVelocity(0);
          // Unload
          // TODO Make it take some time. ⚠️  If logic is not modified after unloading a little of the resource, the villager will go back to resource mine.
          this.closestDeposit.deposit(this.bagpack.amount);
          this.bagpack.amount = 0;

        } else {
          // Note: Here target must be Resource
          this._moveCloserTo(this.closestDeposit.x, this.closestDeposit.y);
        }

        if (this.bagpack.amount == 0 && this.target.amount == 0) {
          this.moveToPosition(this.closestDeposit.getNewVillagerPosition());
        }
      }
    }
  }

  // Private functions
  
  _moveCloserTo(x, y) {
    let vector = new Phaser.Math.Vector2(x-this.x, y-this.y).normalize();
    this.setVelocity(vector.x, vector.y);
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
    this.events.once('map-left-or-middle-clicked', this.unselect, this);
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
