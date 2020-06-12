import Phaser from "phaser";

const TILE_SIZE = 16;

export default class House extends Phaser.GameObjects.GameObject {
  constructor(scene, x, y) {
    super(scene, "custom-game-object");
    this.position = { x: x, y: y };
    this.scene.add.existing(this);

    // Properties
    this.scene = scene;
    this.spritemap = [
      [
        { position: 10 * 57 + 46, collide: false, depth: 10 },
        { position: 10 * 57 + 47, collide: false, depth: 10 },
      ],
      [
        { position: 11 * 57 + 46, collide: true, depth: 0 },
        { position: 11 * 57 + 47, collide: true, depth: 0 },
      ],
    ];
    for (var y = 0; y < this.spritemap.length; y++) {
      for (var x = 0; x < this.spritemap[y].length; x++) {
        let spriteData = this.spritemap[y][x];
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
    let skipAmount = this.spritemap.filter((data) => data[0].collide).length;
    let width = this.spritemap[0].length * TILE_SIZE;
    let height = (this.spritemap.length - skipAmount) * TILE_SIZE;
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
