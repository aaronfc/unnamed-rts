import Phaser from "phaser";
import GUI from "../components/gui.js";
import Alert from "../components/alert.js";
import ActionMenu from "../components/action_menu.js";

export default class UIScene extends Phaser.Scene {
  constructor() {
    super("UIScene");
  }

  create() {
    // TODO Stop using scene's data and use registry
    this.counters = this.scene.get("MainScene").counters;
    this.gui = new GUI(
      this,
      this.sys.game.canvas.width - 310,
      10,
      this.counters
    );
    this.alert = new Alert(
      this,
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height / 10
    );
    this.actionMenu = new ActionMenu(this);

    // Input
    this.input.mouse.disableContextMenu();
  }

  update(time, delta) {
    this.gui.update();
    this.alert.update();
    this.actionMenu.update();
  }
}
