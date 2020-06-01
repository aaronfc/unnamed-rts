import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {}

  create() {
    this.input.mouse.disableContextMenu();

    this.startGameText = this.add
      .text(0, 0, "Start Game", {
        color: "#000000",
        fontSize: 32,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2
      );
    this.startGameText.setInteractive({ useHandCursor: true });
    this.startGameText.on("pointerdown", (pointer) => {
      this.scene.start("MainScene");
      this.scene.start("UIScene");
    });
    this.startGameText.on("pointerover", (pointer) => {
      this.startGameText.setColor("#0000FF");
    });
    this.startGameText.on("pointerout", (pointer) => {
      this.startGameText.setColor("#000000");
    });
  }

  update(time, delta) {}
}
