import TiledGameObject from "../tiled-game-object.js";

export default class Flag extends TiledGameObject {
  constructor(scene, position) {
    let config = {
      spritesheet: "spritesheet1",
      layers: [
        {
          data: [[{ id: 1762, collide: false, depth: 0 }]],
        },
      ],
    };
    super(scene, position.x, position.y, config);
  }

  update() {}
}
