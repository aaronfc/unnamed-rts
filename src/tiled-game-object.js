import Phaser from "phaser";

const TILE_SIZE = 16;

export default class TiledGameObject extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, config) {
    let data = config.layers[0].data;
    let width = data[0].length * TILE_SIZE;
    let height = data.length * TILE_SIZE;
    super(scene, x, y, width, height, 0x000000, 0);
    this.setOrigin(0, 0);
    this.config = config;
    this.spritesheet = config.spritesheet || "spritesheet1";
    this.x = x;
    this.y = y;
    this.scene.add.existing(this);

    // Properties
    this.scene = scene;
    this.tiles = [];

    config.layers.forEach((layer) => {
      this._drawLayer(layer);
    });
  }

  getBounds() {
    // TODO Beware that here we are assuming that the tiles not colliding will come first
    // Also, this will get more complicated if we support multi-layer object composition.
    let data = this.config.layers[0].data;
    let skipAmount = data.filter((data) => !data[0].collide).length;
    let width = data[0].length * TILE_SIZE;
    let height = (data.length - skipAmount) * TILE_SIZE;
    let output = new Phaser.Geom.Rectangle(
      this.x,
      this.y + skipAmount * TILE_SIZE,
      width,
      height
    );
    return output;
  }

  _drawLayer(layer) {
    let data = layer.data;
    for (var y = 0; y < data.length; y++) {
      for (var x = 0; x < data[y].length; x++) {
        let spriteData = data[y][x];
        if (spriteData.id !== null) {
          let sprite = this.scene.add
            .image(
              this.x + x * TILE_SIZE + TILE_SIZE / 2,
              this.y + y * TILE_SIZE + TILE_SIZE / 2,
              this.spritesheet,
              spriteData.id
            )
            .setDepth(spriteData.depth);
          if (spriteData.collide) {
            this.scene.matter.add.gameObject(sprite);
            sprite.setStatic(true);
          }
          this.tiles.push(sprite);
        }
      }
    }
  }

  update() {}

  setVisible(value) {
    this.tiles.forEach((t) => (t.visible = value));
  }

  setAlpha(amount) {
    this.tiles.forEach((t) => t.setAlpha(amount));
  }

  setTint(color) {
    this.tiles.forEach((t) => t.setTint(color));
  }

  clearTint() {
    this.tiles.forEach((t) => t.clearTint());
  }

  destroy() {
    this.tiles.forEach((t) => {
      t.destroy();
    });
    super.destroy(this);
  }

  setPosition(position) {
    if (this.tiles) {
      // We only move the tiles if we already had a position
      let dx = position.x - this.x;
      let dy = position.y - this.y;
      this.tiles.forEach((t) => {
        t.x += dx;
        t.y += dy;
      });
    }
    // TODO Calling setPosition (from Rectangle > Transform) does not work
    this.x = position.x;
    this.y = position.y;
  }
}
