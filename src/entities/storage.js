import TiledGameObject from "../tiled-game-object.js";

const TILE_SIZE = 16;

export default class Storage extends TiledGameObject {
  constructor(scene, x, y) {
    let config = {
      layers: [
        {
          // Ground
          data: [
            [
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
            [
              { id: 1293, collide: true, depth: 0 },
              { id: 1293, collide: true, depth: 0 },
            ],
            [
              { id: 1293, collide: true, depth: 0 },
              { id: 1293, collide: true, depth: 0 },
            ],
          ],
        },
        {
          // Roof
          data: [
            [
              { id: 1233, collide: false, depth: 10 },
              { id: 1234, collide: false, depth: 10 },
            ],
            [
              { id: 1347, collide: true, depth: 0 },
              { id: 1348, collide: true, depth: 0 },
            ],
            [
              { id: 1349, collide: true, depth: 0 },
              { id: 1351, collide: true, depth: 0 },
            ],
          ],
        },
        {
          // Decoration
          data: [
            [
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
            [
              { id: null, collide: true, depth: 0 },
              { id: null, collide: true, depth: 0 },
            ],
            [
              // Door
              { id: 315, collide: true, depth: 0 },
              { id: 316, collide: true, depth: 0 },
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
    this.characteristics = ["STORAGE"];

    // Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (this.status == "building" && pointer.rightButtonDown()) {
        this.events.emit("building-in-progress-right-clicked", this);
      }
    });
  }

  build(units) {
    if (this.buildingAmount >= this.buildingCost) {
      return true; // Already built
    }
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
      return true;
    } else {
      // TODO Send message saying "you cant build here"
      return false;
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

  deposit(amount) {
    this.events.emit("resource-deposit-increased", amount, this);
  }

  update() {}

  _canBeBuilt() {
    let hasEnoughResource = this.scene.counters.resource >= this.buildingCost;
    // TODO Maybe moving this "isFree" logic to the map object?
    let intersectingBuildings = this.scene.map.buildings.filter(
      (b) =>
        !Phaser.Geom.Rectangle.Intersection(
          b.getBounds(),
          this.getBounds()
        ).isEmpty()
    );
    let intersectingResources = this.scene.map.resources.filter(
      (r) =>
        !Phaser.Geom.Rectangle.Intersection(
          r.getBounds(),
          this.getBounds()
        ).isEmpty()
    );
    let positionIsFree =
      intersectingBuildings.length == 0 && intersectingResources.length == 0;
    return hasEnoughResource && positionIsFree;
  }
}
