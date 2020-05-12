import Phaser from "phaser";

export default class Villager extends Phaser.GameObjects.Arc {

  constructor(scene, x, y, townCenter) {
    // Circle
    super(scene, x, y, 5, 0, 360, false, "0x0000FF", 1);
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setCircle(5);
    this.setFrictionAir(0.5); // High friction because we are idle

    // Properties
    this.selected = false;
    this.closestDeposit = townCenter; // TODO Calculate this somewhere else
    this.resourceGatheringSpeed = 5; // Units per second
    this.latestGatheringTime = null;
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
      this._keepMovingTowardsTargetUntilReached(this.target, () => {
        this.setVelocity(0);
        this.target = null;
        this._setStatus('idle');
        this.setFrictionAir(0.5); // High friction because we are idle
      });
    }

    // Collection
    if (this.status == "collecting") {
      
      // Note: Here target must be Resource
      
      // If villager is not full, keeps collecting
      if (this.bagpack.amount < this.bagpack.maxCapacity && this.target.amount > 0) {

        this._keepMovingTowardsTargetUntilReached(this.target, () => {
          // Stop movement
          this.setVelocity(0);
          // Collect resource
          let nowTime = Math.floor(new Date().getTime()/1000);
          let timeSinceLatestGather = nowTime - this.latestGatheringTime;
          if (timeSinceLatestGather >= 1/this.resourceGatheringSpeed) {
            var amountConsumed = this.target.consume(1); // Consuming unit by unit
            this.bagpack.amount += amountConsumed;
            if (amountConsumed < 1) {
              this.target = null; // TODO Calculate next resource
            }
            this.latestGatheringTime = nowTime;
          }
        });

      } else { // Villager is at full capacity

        this._keepMovingTowardsTargetUntilReached(this.closestDeposit, () => {
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

  _setStatus(newStatus) {
    if (newStatus == 'idle') {
      this.setFrictionAir(0.5); // High friction because we are idle
    } else {
      this.setFrictionAir(0.01);
    }
    if (newStatus == 'collecting') {
      this.latestGatheringTime = Math.floor(new Date().getTime() / 1000);
    }
    this.status = newStatus;
  }

  _keepMovingTowardsTargetUntilReached(target, reachedCallback) {
    let marginX = this.width/2 + 2;
    let marginY = this.height/2 + 2;
    if (typeof target.getBounds === "function") { // Checking if target is a point or has an actual body
      let bounds = target.getBounds();
      marginX += bounds.width/2;
      marginY += bounds.height/2;
    }
    if (this._isAsClosestAsPossibleTo(target, marginX, marginY)) {
      reachedCallback();
    } else {
      this._moveCloserTo(target.x, target.y);
    }
  }

  // Public functions

  select() {
    this.setStrokeStyle(1, "0xFF0000");
    this.selected = true;
    // Emit events
    this.events.emit('new-villager-selected');
    // Start listening for events
    this.events.once('resource-right-clicked', this.startCollectingResource, this);
    this.events.once('map-left-or-middle-clicked', this.unselect, this);
    this.events.on('map-right-clicked', this.moveToPosition, this);
    this.events.once('new-building-selected', this.unselect, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    // Stop listening for events
    this.events.off('resource-right-clicked', this.startCollectingResource, this);
    this.events.off('map-left-or-middle-clicked', this.unselect, this);
    this.events.off('map-right-clicked', this.moveToPosition, this);
    this.events.off('new-building-selected', this.unselect, this);
  }

  moveToPosition(position) {
    this.target = new Phaser.Math.Vector2(position.x, position.y);
    this._setStatus('walking-to-destination');
  }

  startCollectingResource(resource) {
    this._setStatus('collecting');
    this.target = resource;
    this.unselect();
  }

}
