import Phaser from "phaser";
import BootScene from "./scenes/boot.js";
import MainScene from "./scenes/main.js";
import UIScene from "./scenes/ui.js";
import MenuScene from "./scenes/menu.js";
import GameOverScene from "./scenes/game-over.js";
import MeshTesting from "./scenes/mesh-testing.js";

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
  width: 1080,
  height: 720,
  scene: [BootScene, MenuScene, MainScene, UIScene, GameOverScene, MeshTesting],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#FFFFFF",
  pixelArt: true,
};

const game = new Phaser.Game(config);
