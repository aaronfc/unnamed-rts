import Phaser from "phaser";

export default class Map extends Phaser.GameObjects.Rectangle {
  constructor(scene, width, height) {
    // Create the backgroun (map)
    super(scene, 0, 0, width, height, "0xDDFFDD");
    scene.add.existing(this);
    this.setOrigin(0, 0);

    // Properties
    this.scene = scene;
    this.buildings = [];
    this.resources = [];
    this.selectingRectangle = scene.add
      .rectangle(0, 0, 0, 0, "0x0000FF", 0.1)
      .setOrigin(0, 0)
      .setDepth(900)
      .setVisible(false);

    // Input
    this.setInteractive({ draggable: true });

    // Multi-selection
    this.on("dragstart", (pointer, dragX, dragY) => {
      this.selectingRectangle
        .setSize(0, 0)
        .setPosition(pointer.worldX, pointer.worldY)
        .setVisible(true);
    });
    this.on("drag", (pointer, dragX, dragY) => {
      this.selectingRectangle.width =
        pointer.worldX - this.selectingRectangle.x;
      this.selectingRectangle.height =
        pointer.worldY - this.selectingRectangle.y;
      // TODO Improve performance on this.
      this.scene.villagers.forEach((v) => {
        if (this.selectingRectangle.getBounds().contains(v.x, v.y)) {
          v.select();
        } else {
          v.unselect();
        }
      });
    });
    this.on("dragend", (pointer, dragX, dragY) => {
      this.selectingRectangle.visible = false;
    });
  }

  update() {
    this.buildings.forEach((b) => b.update());
    this.resources.forEach((r) => r.update());
  }

  addBuilding(building) {
    this.buildings.push(building);
  }

  addResource(resource) {
    this.resources.push(resource);
  }

  // Events

  onResourceDestroyed(resource) {
    this.resources = this.resources.filter((r) => r != resource);
  }
}
