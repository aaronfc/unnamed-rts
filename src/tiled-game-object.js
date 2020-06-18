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
    this.position = { x: x, y: y };
    this.scene.add.existing(this);

    // Properties
    this.scene = scene;
    this.data = data;
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
    let width = this.data[0].length * TILE_SIZE;
    let height = (this.data.length - skipAmount) * TILE_SIZE;
    let output = new Phaser.Geom.Rectangle(
      this.position.x,
      this.position.y + skipAmount * TILE_SIZE,
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
              this.position.x + x * TILE_SIZE + TILE_SIZE / 2,
              this.position.y + y * TILE_SIZE + TILE_SIZE / 2,
              "spritesheet1",
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

  setAlpha(amount) {
    this.tiles.forEach((t) => t.setAlpha(amount));
  }

  destroy() {}
}
