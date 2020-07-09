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

    // Properties
    this.events = scene.events;
    this.status = "placing"; // placing | building | built
    this.buildingCost = 50;
    this.buildingAmount = 0;
    this.setAlpha(0.5);

    // Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.rightButtonDown()) {
        this.events.emit("building-in-progress-right-clicked", this);
      }
    });
  }

  build(units) {
    // Increase buildingProgress
    this.buildingAmount += units;
    let progress = this.buildingAmount / this.buildingCost;
    this.setAlpha(0.5 + progress * 0.5);
    if (progress >= 1) {
      this.status = "built";
      this.clearTint();
    }
    return this.status == "built"; // return true when the building is done
  }

  place() {
    // Check if construction is possible
    if (this._canBeBuilt()) {
      this.status = "building";
      this.setTint(0xcccccc);
    } else {
      // TODO Send message saying "you cant build here"
    }
  }

  destroy() {
    this.events.emit("building-destroyed", this);
    super.destroy(this);
  }

  move(position) {
    this.setPosition(position);
    if (this._canBeBuilt(position)) {
      this.setTint(0xaaffaa);
    } else {
      this.setTint(0xffaaaa);
    }
  }

  update() {}

  _canBeBuilt() {
    return Math.random() > 0.5;
  }
}
