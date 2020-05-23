import Phaser from "phaser";
import GUI from "../gui.js";
import GameOverScreen from "../gameover-screen.js";

export default class UIScene extends Phaser.Scene {

  constructor() {
    super({key: 'UIScene', active: true});
  }

  preload() {
    this.load.image('villager-icon', 'assets/villager-icon.png');
    this.load.image('resource-icon', 'assets/resource-icon.png');
    this.load.image('time-icon', 'assets/time-icon.png');
  }

  create() {
    // TODO Stop using scene's data and use registry
    this.isGameOver = false;
    this.counters = this.scene.get('MainGameScene').counters;
    this.gui = new GUI(this, this.sys.game.canvas.width - 270, 10, this.counters);
    this.gameoverScreen = new GameOverScreen(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, this.counters);

    // Input
    this.input.mouse.disableContextMenu();
  }

  update(time, delta) {
    if (!this.isGameOver) {
      this.gui.update();
      if (this.counters.villagers <= 0) {
        this.isGameOver = true;
        this.gameoverScreen.show();
        this.time.removeAllEvents();
      }
    }
  }
}
