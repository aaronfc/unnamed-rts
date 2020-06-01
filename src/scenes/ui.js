import Phaser from "phaser";
import GUI from "../components/gui.js";
import Alert from "../components/alert.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
  }

  preload() {
    this.load.image("villager-icon", "assets/villager-icon.png");
    this.load.image("resource-icon", "assets/resource-icon.png");
    this.load.image("time-icon", "assets/time-icon.png");
  }

  create() {
    // TODO Stop using scene's data and use registry
    this.counters = this.scene.get("MainScene").counters;
    this.gui = new GUI(
      this,
      this.sys.game.canvas.width - 270,
      10,
      this.counters
    );
    this.alert = new Alert(
      this,
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height / 10
    );

    // Input
    this.input.mouse.disableContextMenu();
  }

  update(time, delta) {
    this.gui.update();
    this.alert.update();
  }
}
