import TiledGameObject from "../tiled-game-object.js";

const TILE_SIZE = 16;

export default class House extends TiledGameObject {
  constructor(scene, x, y) {
    super(scene, x, y, [
      [
        { position: 10 * 57 + 46, collide: false, depth: 10 },
        { position: 10 * 57 + 47, collide: false, depth: 10 },
      ],
      [
        { position: 11 * 57 + 46, collide: true, depth: 0 },
        { position: 11 * 57 + 47, collide: true, depth: 0 },
      ],
    ]);
  }
}
