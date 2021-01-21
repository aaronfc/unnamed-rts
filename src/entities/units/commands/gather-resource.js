import Movement from "../../../behaviours/movement.js";

export default class GatherResourceCommand {
  constructor(entity, resource) {
    this.entity = entity;
    this.resource = resource;
    this.latestGatheringTime = 0;
    this.resourceGatheringSpeed = 0.5; // Units per second

    this.done = false; // Changing to true when reaching the destination
    // Behaviours
    this.movement = new Movement(this.entity.scene);

    // ⚠️ TODO Fix this reference to entity's scene
  }

  update() {
    // If villager is not full, keeps collecting
    if (
      this.entity.bagpack.amount < this.entity.bagpack.maxCapacity &&
      this.resource.amount > 0
    ) {
      this.movement.moveTo(this.entity, this.resource, () => {
        // Stop movement
        this.entity.setVelocity(0);
        // Collect resource
        let nowTime = new Date().getTime() / 1000;
        let timeSinceLatestGather = nowTime - this.latestGatheringTime;
        if (timeSinceLatestGather >= 1 / this.resourceGatheringSpeed) {
          var amountConsumed = this.resource.consume(1); // Consuming unit by unit
          this.entity.bagpack.amount += amountConsumed;
          if (amountConsumed < 1) {
            this.resource = null; // TODO Calculate next resource
          }
          this.latestGatheringTime = nowTime;
        }
      });
    } else {
      // Calculate closest deposit
      let closestDeposit = this.entity.scene.map.getClosestEntity(
        this,
        this.entity.scene.map.buildings.filter(
          (b) => b.status == "built" && b.characteristics.includes("STORAGE")
        )
      );
      // Villager is at full capacity
      this.movement.moveTo(this.entity, closestDeposit, () => {
        this.entity.setVelocity(0);
        // Unload
        // TODO Make it take some time. ⚠️  If logic is not modified after unloading a little of the resource, the villager will go back to resource mine.
        closestDeposit.deposit(this.entity.bagpack.amount);
        this.entity.bagpack.amount = 0;
      });

      if (this.entity.bagpack.amount == 0 && this.resource.amount == 0) {
        this.resource = this.entity.scene.map.getClosestEntity(
          this.entity,
          this.entity.scene.map.resources
        );
      }
    }
  }
}
