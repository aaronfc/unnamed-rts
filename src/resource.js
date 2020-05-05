
import Phaser from "phaser";

export default class Resource extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y, initialAmount) {
    // Create resource mine
    super(scene, x, y, 30, 30, "0xFF00FF");
    scene.add.existing(this);
    scene.physics.add.existing(this, 1);

    // Properties
    this.initialAmount = initialAmount;
    this.amount = initialAmount;
    this.events = scene.events;

    // Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      if (pointer.rightButtonDown()) {
        scene.events.emit('resource-right-clicked', this);
      }
    });
  }

  update() {
    this.setAlpha(this.amount / this.initialAmount);

    if (this.amount == 0) {
      this.destroy();
      this.events.emit('resource-destroyed', this);
    }
  }

  consume(units) {
    if (this.amount >= units) {
      this.amount -= units;
      return units;
    } else {
      return this.amount;
    }
  }
}
