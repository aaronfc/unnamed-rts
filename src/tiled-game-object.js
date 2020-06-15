import Phaser from "phaser";

const TILE_SIZE = 16;

export default class TiledGameObject extends Phaser.GameObjects.GameObject {
  constructor(scene, x, y, data) {
    super(scene, "custom-game-object");
    this.position = { x: x, y: y };
    this.scene.add.existing(this);

    // Properties
    this.scene = scene;
    this.data = data;
    for (var y = 0; y < this.data.length; y++) {
      for (var x = 0; x < this.data[y].length; x++) {
        let spriteData = this.data[y][x];
        let sprite = scene.add
          .image(
            this.position.x + x * TILE_SIZE,
            this.position.y + y * TILE_SIZE,
            "spritesheet1",
            spriteData.position
          )
          .setDepth(spriteData.depth)
          .setOrigin(0);
        if (spriteData.collide) {
          scene.matter.add.gameObject(sprite);
          sprite.setStatic(true);
          sprite.setOrigin(0);
        }
      }
    }
  }

  getBounds() {
    // TODO Beware that here we are assuming that the tiles not colliding will come first
    // Also, this will get more complicated if we support multi-layer object composition.
    let skipAmount = this.data.filter((data) => data[0].collide).length;
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

  update() {}
}
