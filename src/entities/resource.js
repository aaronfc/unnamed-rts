import Phaser from "phaser";
import TiledGameObject from "../tiled-game-object.js";

export default class Resource extends TiledGameObject {
  constructor(scene, position, initialAmount) {
    let config = {
      layers: [
        {
          // Ground
          data: [[{ id: 1409, collide: true, depth: 0 }]],
        },
      ],
    };
    super(scene, position.x, position.y, config);

    // Properties
    this.initialAmount = initialAmount;
    this.amount = initialAmount;
    this.events = scene.events;

    // Events
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 16, 16),
      Phaser.Geom.Rectangle.Contains
    );
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.rightButtonDown()) {
        this.events.emit("resource-right-clicked", this);
      }
    });
    console.log(this);
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
