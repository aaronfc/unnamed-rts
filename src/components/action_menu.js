import Phaser from "phaser";
import House from "../entities/house.js";

const ICON_SIZE = 32;
const ICONS_PADDING = 10;
const PRICE_SUBICON_SIZE = 16;
const SUBICON_PADDING = 5;

// TODO ⚠️  Move this to a proper place
const HOUSE_BUILDING_COST = 50;

export default class ActionMenu extends Phaser.GameObjects.Container {
  constructor(scene) {
    let width = 300;
    let height =
      ICON_SIZE + ICONS_PADDING * 2 + PRICE_SUBICON_SIZE + SUBICON_PADDING;
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

    // Build house icon
    this.buildTentIcon = scene.add
      .image(
        this.backgroundRectangle.x -
          this.backgroundRectangle.width / 2 +
          ICON_SIZE / 2 +
          ICONS_PADDING,
        this.backgroundRectangle.y -
          this.backgroundRectangle.height / 2 +
          ICON_SIZE / 2 +
          ICONS_PADDING,
        "house-icon"
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    // Adding action to the buildTentIcon
    this.buildTentIcon.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        if (this.scene.counters.resource >= HOUSE_BUILDING_COST) {
          let house = new House(this.scene.scene.get("MainScene"), 0, 0);
          let mainScene = this.scene.scene.get("MainScene");
          let moveFunction = house.move.bind(house);
          let placeFunction = () => {
            if (house.place()) {
              this.scene.counters.resource -= HOUSE_BUILDING_COST;
              console.log("Placing");
              mainScene.events.off("mouse-moving-over-map", moveFunction);
              mainScene.selectedVillagers.forEach((v) =>
                v.startBuilding(house)
              );
              mainScene.map.addBuilding(house);
            } else {
              console.log("Not placing");
              this.scene.scene
                .get("UIScene")
                .events.emit("alert-message", "You can't build here!");
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
        } else {
          this.scene.scene
            .get("UIScene")
            .events.emit("alert-message", "Not enough resource!");
        }
      }
    });
    this.add(this.buildTentIcon);

    this.costIcon = scene.add
      .image(
        this.backgroundRectangle.x -
          this.backgroundRectangle.width / 2 +
          PRICE_SUBICON_SIZE / 2 +
          SUBICON_PADDING,
        this.backgroundRectangle.y -
          this.backgroundRectangle.height / 2 +
          ICON_SIZE +
          ICONS_PADDING +
          PRICE_SUBICON_SIZE / 2 +
          SUBICON_PADDING,
        "resource-icon"
      )
      .setScale(0.5)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    this.add(this.costIcon);

    this.costText = scene.add.text(
      this.costIcon.x + PRICE_SUBICON_SIZE / 2 + SUBICON_PADDING,
      this.costIcon.y - PRICE_SUBICON_SIZE / 2,
      "50",
      { color: "#000", fontSize: 14 }
    );
    this.add(this.costText);
  }

  update() {
    let selectedVillagers = this.scene.scene.get("MainScene").selectedVillagers;
    this.visible = selectedVillagers.length > 0;
  }
}
