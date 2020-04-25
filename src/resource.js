
import Phaser from "phaser";

export default class Resource extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y) {
    // Create resource mine
    super(scene, x, y, 30, 30, "0xFF00FF");
    scene.add.existing(this);
    scene.physics.add.existing(this, 1);

    // Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      if (pointer.rightButtonDown()) {
        scene.events.emit('resource-right-clicked', this);
      }
    });
  }

  update() {
  }

}
