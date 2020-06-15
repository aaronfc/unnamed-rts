import Phaser from "phaser";

export default class Resource extends Phaser.GameObjects.Rectangle {
  constructor(scene, position, initialAmount) {
    // Create resource mine
    super(scene, position.x, position.y, 30, 30, "0xFF00FF");
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setStatic(true);

    // Properties
    this.scene = scene;
    this.initialAmount = initialAmount;
    this.amount = initialAmount;
    this.events = scene.events;

    // Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.rightButtonDown()) {
        this.events.emit("resource-right-clicked", this);
      }
    });
  }

  update() {
    this.setAlpha(this.amount / this.initialAmount);

    if (this.amount == 0) {
      this.scene.scene
        .get("UIScene")
        .events.emit("alert-message", "Resource exhausted ...");
      this.events.emit("resource-destroyed", this);
      this.destroy();
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
