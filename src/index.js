import Phaser from "phaser";
import MainGameScene from "./scenes/main-game.js";
import UIScene from "./scenes/ui.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  physics: {
    default: "matter",
    matter: {
      debug: false,
      gravity: { x: 0, y: 0 },
    },
  },
  width: 916, // This is the real size in pixels of half my screen so that we do not have blurry text after 100% width resize in index.html
  height: 600,
  scene: [MainGameScene, UIScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#FFFFFF",
};

const game = new Phaser.Game(config);
