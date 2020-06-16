import TiledGameObject from "../tiled-game-object.js";

const TILE_SIZE = 16;

export default class House extends TiledGameObject {
  constructor(scene, x, y) {
    let config = {
      layers: [
        {
          // Ground
          data: [
            [
              { id: 10 * 57 + 46, collide: false, depth: 10 },
              { id: 10 * 57 + 47, collide: false, depth: 10 },
            ],
            [
              { id: 11 * 57 + 46, collide: true, depth: 0 },
              { id: 11 * 57 + 47, collide: true, depth: 0 },
            ],
          ],
        },
      ],
    };
    super(scene, x, y, config);
  }
}
