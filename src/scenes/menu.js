import Phaser from "phaser";

// Set it to TRUE to skip the menu scene
const AUTOSTART = false;

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {}

  create() {
    this.input.mouse.disableContextMenu();

    this.gameNameTitleText = this.add
      .text(0, 0, " Unnamed RTS... ", {
        color: "#FFFFFF",
        backgroundColor: "#000000",
        fontSize: 64,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 10
      );

    this.startGameText = this.add
      .text(0, 0, "> Start Game", {
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
      this.goToGameScene();
    });
    this.startGameText.on("pointerover", (pointer) => {
      this.startGameText.setColor("#0000FF");
    });
    this.startGameText.on("pointerout", (pointer) => {
      this.startGameText.setColor("#000000");
    });

    if (AUTOSTART) {
      this.goToGameScene();
    }
  }

  update(time, delta) {}

  goToGameScene() {
    this.scene.start("MainScene");
    this.scene.start("UIScene");
  }
}
