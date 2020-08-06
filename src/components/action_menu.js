import Phaser from "phaser";
import House from "../entities/house.js";

export default class ActionMenu extends Phaser.GameObjects.Container {
  constructor(scene) {
    let width = 300;
    let height = 200;
    let x = scene.sys.game.canvas.width - width / 2;
    let y = scene.sys.game.canvas.height - height / 2;
    // Rectangle
    super(scene, x, y, []);
    scene.add.existing(this);
    this.setDepth(500);
    this.visible = false;

    // Properties
    this.scene = scene;
    this.events = scene.events;

    // Create all GUI elements

    // Background (rectangle)
    this.backgroundRectangle = scene.add
      .rectangle(0, 0, width, height, "0xa0beff")
      .setOrigin(0.5);
    this.add(this.backgroundRectangle);

    // Villagers info
    this.buildTentIcon = scene.add
      .image(
        this.backgroundRectangle.x - this.backgroundRectangle.width / 2 + 20,
        this.backgroundRectangle.y - this.backgroundRectangle.height / 2 + 20,
        "villager-icon" // TODO Change the asset to a "tent" or a house
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    // Adding action to the buildTentIcon
    this.buildTentIcon.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        let house = new House(this.scene.scene.get("MainScene"), 0, 0);
        let mainScene = this.scene.scene.get("MainScene");
        let moveFunction = house.move.bind(house);
        let placeFunction = () => {
          if (house.place()) {
            console.log("Placing");
            mainScene.events.off("mouse-moving-over-map", moveFunction);
            mainScene.selectedVillagers.forEach((v) => v.startBuilding(house));
            mainScene.map.addBuilding(house);
          } else {
            console.log("Not placing");
            // ⚠️  We need to keep listening to map-right-clicked. Using "on" instead of playing with "once" didn't work out of the box. Maybe we can make it work with giving a second thought to the events management.
            mainScene.events.once("map-right-clicked", placeFunction);
          }
        };
        mainScene.events.on("mouse-moving-over-map", moveFunction);
        mainScene.input.keyboard.once("keydown-ESC", () => {
          mainScene.events.off("mouse-moving-over-map", moveFunction);
          mainScene.events.off("map-right-clicked", placeFunction);
          if (house.status == "placing") {
            house.destroy();
          }
        });
        mainScene.events.once("map-right-clicked", placeFunction);
        event.stopPropagation();
      }
    });
    this.add(this.buildTentIcon);
  }

  update() {
    let selectedVillagers = this.scene.scene.get("MainScene").selectedVillagers;
    this.visible = selectedVillagers.length > 0;
  }
}
