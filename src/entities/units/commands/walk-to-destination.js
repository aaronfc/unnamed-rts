import Movement from "../../../behaviours/movement.js";

export default class WalkToDestinationCommand {
  constructor(entity, destination) {
    this.entity = entity;
    this.destination = destination;
    this.done = false; // Changing to true when reaching the destination
    // Behaviours
    this.movement = new Movement(this.entity.scene);
  }

  update() {
    if (this.done) {
      return true;
    }
    this.movement.moveTo(this.entity, this.destination, () => {
      this.done = true;
    });
    return false;
  }
}
