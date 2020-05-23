import Phaser from "phaser";

export default class GameOverScreen extends Phaser.GameObjects.Container {
  constructor(scene, x, y, counters) {
    super(scene, x, y, []);
    scene.add.existing(this);
    this.setDepth(999);
    this.visible = false;
    this.setScrollFactor(0);

    // Properties
    this.counters = counters;
    this.scene = scene;

    // Create all GUI elements

    // Background (rectangle)
    this.backgroundRectangle = scene.add
      .rectangle(0, 0, 500, 250, "0x333333")
      .setAlpha(0.8);
    this.add(this.backgroundRectangle);

    // Game Over title text
    this.gameOverText = scene.add
      .text(0, -75, "GAME OVER", { color: "#FF0000", fontSize: 32 })
      .setOrigin(0.5, 0.5);
    this.add(this.gameOverText);

    // Game Over title text
    this.gameOverText = scene.add
      .text(0, -10, "You survived for:", { color: "#FFFFFF", fontSize: 26 })
      .setOrigin(0.5, 0.5);
    this.add(this.gameOverText);
    this.survivalTimeText = scene.add
      .text(0, 25, this._formatGameTime(), { color: "#FFFFFF", fontSize: 26 })
      .setOrigin(0.5, 0.5);
    this.add(this.survivalTimeText);

    // Restart button
    this.restartButton = scene.add.container(0, 75);
    this.restartButton.add(scene.add.rectangle(0, 0, 120, 25, "0xFFFFFF"));
    this.restartButton.add(
      scene.add
        .text(0, 0, "Play again", { color: "#000000", fontSize: 16 })
        .setOrigin(0.5, 0.5)
    );
    this.restartButton.setSize(120, 25);
    this.restartButton.setInteractive({ useHandCursor: true });
    this.restartButton.on("pointerdown", (pointer) => {
      if (pointer.leftButtonDown()) {
        this._restartGame();
      }
    });
    this.add(this.restartButton);
  }

  // Private methods

  _formatGameTime() {
    return new Date(this.counters.gameTime * 1000).toISOString().substr(11, 8);
  }

  _restartGame() {
    // Restart game scene
    this.scene.scene.get("MainGameScene").registry.destroy();
    this.scene.scene.get("MainGameScene").events.off();
    this.scene.scene.get("MainGameScene").scene.restart();
    // Restart UI Scene
    this.scene.registry.destroy();
    this.scene.events.off();
    this.scene.scene.restart();
  }

  // Public method

  show() {
    this.survivalTimeText.setText(this._formatGameTime());
    this.visible = true;
  }
}
