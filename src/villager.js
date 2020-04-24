import Phaser from "phaser";

export default class Villager extends Phaser.GameObjects.Arc {

  constructor(scene, x, y, mainBuilding) {
    // Circle
    super(scene, x, y, 5, 0, 360, false, "0x0000FF", 1);
    scene.add.existing(this);

    // Properties
    this.selected = false;
    this.destination = new Phaser.Math.Vector2(x, y);
    this.closestDeposit = mainBuilding; // TODO Calculate this somewhere else
    this.target = null;
    this.status = 'idle';
    this.bagpack = {
      maxCapacity: 300,
      amount: 0
    }
    this.events = scene.events;

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
    if (this.destination != null) {

      this._moveCloserTo(this.destination.x, this.destination.y);

      var villagerDistanceToDestinationX = Math.abs(this.destination.x - this.x);
      var villagerDistanceToDestinationY = Math.abs(this.destination.y - this.y);
      if (villagerDistanceToDestinationY < 1 && villagerDistanceToDestinationX < 1) {
        this.destination = null;
      }
    }

    // Collection
    if (this.status == "collecting") {
      
      // If villager is not full it he collects
      if (this.bagpack.amount < this.bagpack.maxCapacity) {
        // Note: Here target must be Resource
        this._moveCloserTo(this.target.x, this.target.y);

        var distanceToResourceX = Math.abs(this.target.x - this.x);
        var distanceToResourceY = Math.abs(this.target.y - this.y);
        if (distanceToResourceX < 1 && distanceToResourceY < 1) {
          // Collect
          this.bagpack.amount += 1;
          // TODO Discount amount from resource
        }

      } else { // Villager is at full capacity

        this._moveCloserTo(this.closestDeposit.x, this.closestDeposit.y);

        var distanceToDepositX = Math.abs(this.closestDeposit.x - this.x);
        var distanceToDepositY = Math.abs(this.closestDeposit.y - this.y);
        if (distanceToDepositX < 1 && distanceToDepositY < 1) {
          // Unload
          this.bagpack.amount = 0;
        }
 
      }
    }
  }

  // Private functions
  
  _moveCloserTo(x, y) {
    var distanceX = Math.abs(x - this.x);
    var distanceY = Math.abs(y - this.y);

    if (distanceX >= 1) {
      this.x += x > this.x ? 1 : -1;
    }
    if (distanceY >= 1) {
      this.y += y > this.y ? 1 : -1;
    }
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
    this.status = 'moving';
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
