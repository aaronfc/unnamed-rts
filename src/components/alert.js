import Phaser from "phaser";

export default class Alert extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    // Container
    super(scene, x, y, []);
    scene.add.existing(this);
    this.setDepth(999);
    this.setScrollFactor(0);
    this.visible = false;
    this.alpha = 0;

    // Properties
    this.scene = scene;

    // Create all GUI elements

    // Background (rectangle)
    this.backgroundRectangle = scene.add
      .rectangle(0, 0, 400, 50, "0xFF0000")
      .setStrokeStyle(2, "0xFF0000", 1)
      .setOrigin(0.5)
      .setAlpha(0.5);
    this.add(this.backgroundRectangle);

    // Actual text
    this.text = scene.add
      .text(
        0,
        0,
        "You are under attack!",
        { color: "#000000", fontSize: 20 }
      )
      .setOrigin(0.5);
    this.add(this.text);

    // Events
    this.scene.events.on('alert-message', (text) => { this.alert(text); }, this);
  }

  update() {
    if (this.alpha > 0) {
      this.alpha -= 0.02;
    } else {
      this.visible = false;
    }
  }

  alert(text) {
    this.visible = true;
    this.alpha = 1;
    this.text.setText(text);
    // Start some timer so that opacity is reduced
  }

}
