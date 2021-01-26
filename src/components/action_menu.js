import Phaser from "phaser";
import House from "../entities/buildings/house.js";
import Storage from "../entities/buildings/storage.js";
import Tower from "../entities/buildings/tower.js";

const ICON_SIZE = 32;
const ICONS_PADDING = 10;
const PRICE_SUBICON_SIZE = 16;
const SUBICON_PADDING = 2;

const BUILDABLE_ITEMS = [
  { name: "House", icon: "house-icon", clazz: House, cost: 50 },
  { name: "Storage", icon: "barn-icon", clazz: Storage, cost: 50 },
  { name: "Tower", icon: "tower-icon", clazz: Tower, cost: 150 },
];

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

    BUILDABLE_ITEMS.forEach((item, index) => {
      let icon = this.createIcon(this.backgroundRectangle, index, item);
    });
  }

  update() {
    let selectedVillagers = this.scene.scene.get("MainScene").selectedVillagers;
    this.visible = selectedVillagers.length > 0;
  }

  createIcon(background, index, item) {
    // Create visual icon
    let icon = this.scene.add
      .image(
        background.x -
          background.width / 2 +
          index * (ICON_SIZE + ICONS_PADDING * 2) +
          ICON_SIZE / 2 +
          ICONS_PADDING,
        background.y - background.height / 2 + ICON_SIZE / 2 + ICONS_PADDING,
        item.icon
      )
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" });
    // Adding action
    icon.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        if (this.scene.counters.resource >= item.cost) {
          let building = new item.clazz(
            this.scene.scene.get("MainScene"),
            0,
            0
          );
          let mainScene = this.scene.scene.get("MainScene");
          let moveFunction = (pointer) => {
            building.move({ x: pointer.worldX, y: pointer.worldY });
          };
          let placeFunction = () => {
            if (building.place()) {
              this.scene.counters.resource -= item.cost;
              console.log("Placing");
              mainScene.input.off("pointermove", moveFunction);
              mainScene.selectedVillagers.forEach((v) =>
                v.startBuilding(building)
              );
              mainScene.map.addBuilding(building);
              mainScene.navigation.regenerate();
            } else {
              console.log("Not placing");
              this.scene.scene
                .get("UIScene")
                .events.emit("alert-message", "You can't build here!");
              // ⚠️  We need to keep listening to map-right-clicked. Using "on" instead of playing with "once" didn't work out of the box. Maybe we can make it work with giving a second thought to the events management.
              mainScene.events.once("map-right-clicked", placeFunction);
            }
          };
          mainScene.input.on("pointerdown", (pointer) => {
            if (pointer.leftButtonDown()) {
              mainScene.input.off("pointermove", moveFunction);
              mainScene.events.off("map-right-clicked", placeFunction);
              if (building.status == "placing") {
                building.destroy();
              }
            }
          });
          mainScene.input.on("pointermove", moveFunction);
          mainScene.input.keyboard.once("keydown-ESC", () => {
            mainScene.input.off("pointermove", moveFunction);
            mainScene.events.off("map-right-clicked", placeFunction);
            if (building.status == "placing") {
              building.destroy();
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
    this.add(icon);

    let costIcon = this.scene.add
      .image(
        icon.x - ICON_SIZE / 2 + PRICE_SUBICON_SIZE / 2,
        icon.y + ICON_SIZE / 2 + PRICE_SUBICON_SIZE / 2 + SUBICON_PADDING,
        "resource-icon"
      )
      .setScale(0.5)
      .setOrigin(0.5);
    this.add(costIcon);

    let costText = this.scene.add.text(
      costIcon.x + PRICE_SUBICON_SIZE / 2 + SUBICON_PADDING,
      costIcon.y - PRICE_SUBICON_SIZE / 2,
      item.cost,
      { color: "#000", fontSize: 12 }
    );
    this.add(costText);
  }
}
