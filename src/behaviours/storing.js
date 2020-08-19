export default class Storing {
  constructor(scene) {
    this.scene = scene;
    this.events = scene.events;
  }

  deposit(amount) {
    this.events.emit("resource-deposit-increased", amount);
  }
}
