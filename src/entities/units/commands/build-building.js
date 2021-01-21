import Movement from "../../../behaviours/movement.js";

export default class BuildBuildingCommand {
  constructor(entity, building) {
    this.entity = entity;
    this.building = building;
    this.buildingSpeed = 5; // Units per second
    this.latestBuildingTime = 0;
    this.done = false;
    // Behaviours
    this.movement = new Movement(this.entity.scene); // TODO Fix this reference to entity's scene
  }

  update() {
    this.movement.moveTo(this.entity, this.building, () => {
      // Stop movement
      this.entity.setVelocity(0);
      // Collect resource
      let nowTime = new Date().getTime() / 1000;
      let timeSinceLatestBuild = nowTime - this.latestBuildingTime;
      if (timeSinceLatestBuild >= 1) {
        var isComplete = this.building.build(this.buildingSpeed); // TODO Take into account "building speed"
        if (isComplete) {
          this.done = true; // Done!
          // TODO Calculate next building
        }
        this.latestBuildingTime = nowTime;
      }
    });
    return this.done;
  }
}
