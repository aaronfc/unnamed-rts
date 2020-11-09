import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {}

  create() {
    this.input.mouse.disableContextMenu();

    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 1)");
    this.loadingText = this.add
      .text(0, 0, "Loading...", {
        color: "#FFFFFF",
        fontSize: 32,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2
      );

    // Start loading all the assets
    this.load.image("villager-icon", "assets/villager-icon.png");
    this.load.image("resource-icon", "assets/resource-icon.png");
    this.load.image("time-icon", "assets/time-icon.png");
    this.load.image("house-icon", "assets/house-icon.png");
    this.load.image("barn-icon", "assets/barn-icon.png");
    this.load.image("tower-icon", "assets/tower-icon.png");
    this.load.image("boy", "assets/boy.png");
    this.load.image("girl", "assets/girl.png");
    this.load.spritesheet("spritesheet1", "assets/rogelike-spritesheet.png", {
      frameWidth: 16,
      frameHeight: 16,
      spacing: 1,
    });
    this.load.once("complete", this._onLoadCompleted.bind(this));
    this.load.start();
  }

  update(time, delta) {}

  // Private methods

  _onLoadCompleted() {
    this.scene.start("MenuScene");
  }
}
