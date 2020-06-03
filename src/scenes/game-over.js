import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {}

  create(data) {
    this.currentSurvivalInSeconds = data.currentSurvivalInSeconds;
    this.longestSurvivalInSeconds = data.longestSurvivalInSeconds;

    this.input.mouse.disableContextMenu();

    this.gameOverTitleText = this.add
      .text(0, 0, " Game Over ", {
        color: "#FFFFFF",
        backgroundColor: "#FF0000",
        fontSize: 64,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 10
      );
    let formattedSurvivalTime = this._formatGameTime(
      this.currentSurvivalInSeconds
    );
    let feedbackMessage =
      this.currentSurvivalInSeconds > this.longestSurvivalInSeconds
        ? "Well done! 🎉🎉🎉"
        : "Keep going. You can do better!";
    this.feedbackMessageText = this.add
      .text(0, 0, feedbackMessage, {
        color: "#000000",
        fontSize: 40,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 3
      );
    this.survivalTimeText = this.add
      .text(0, 0, `You survived for ${formattedSurvivalTime}`, {
        color: "#000000",
        fontSize: 32,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height / 2
      );
    let formattedBestSurvivalTime = this._formatGameTime(
      this.longestSurvivalInSeconds
    );
    this.survivalTimeText = this.add
      .text(0, 0, `Best score: ${formattedBestSurvivalTime}`, {
        color: "#000000",
        fontSize: 32,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height * 0.55
      );

    this.playAgainText = this.add
      .text(0, 0, "> Play Again", {
        color: "#000000",
        fontSize: 40,
      })
      .setOrigin(0.5)
      .setPosition(
        this.sys.game.canvas.width / 2,
        this.sys.game.canvas.height * 0.9
      );
    this.playAgainText.setInteractive({ useHandCursor: true });
    this.playAgainText.on("pointerdown", (pointer) => {
      this.scene.start("MainScene");
      this.scene.start("UIScene");
    });
    this.playAgainText.on("pointerover", (pointer) => {
      this.playAgainText.setColor("#0000FF");
    });
    this.playAgainText.on("pointerout", (pointer) => {
      this.playAgainText.setColor("#000000");
    });
  }

  update(time, delta) {}

  _formatGameTime(timeInSeconds) {
    return new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
  }
}
