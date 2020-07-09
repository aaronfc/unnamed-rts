import Phaser from "phaser";

export default class Map extends Phaser.GameObjects.Rectangle {
  constructor(scene, widthTiles, heightTiles, tileSize) {
    // Create the backgroun (map)
    super(
      scene,
      0,
      0,
      widthTiles * tileSize,
      heightTiles * tileSize,
      "0x00000000"
    );
    scene.add.existing(this);

    // Properties
    this.widthTiles = widthTiles;
    this.heightTiles = heightTiles;
    this.tileSize = tileSize;
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
    this.on("pointermove", (pointer) => {
      this.scene.events.emit("mouse-moving-over-map", {
        x: pointer.worldX,
        y: pointer.worldY,
      });
    });

    this.tilemap = scene.make.tilemap({
      key: "map",
      tileWidth: this.tileSize,
      tileHeight: this.tileSize,
      width: this.widthTiles,
      height: this.heightTiles,
    });
    var tiles = this.tilemap.addTilesetImage(
      "spritesheet1",
      "spritesheet1",
      this.tileSize,
      this.tileSize,
      0,
      1
    );
    var layer = this.tilemap.createBlankDynamicLayer(
      "ground-background",
      tiles
    );
    layer.randomize(0, 0, this.tilemap.width, this.tilemap.height, [5, 62]);
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

  onBuildingDestroyed(building) {
    this.buildings = this.buildings.filter((b) => b != building);
  }
}
