import TiledGameObject from "../tiled-game-object.js";
import Building from "../behaviours/building.js";

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
    this.populationIncrease = 5;
    this.setAlpha(0.5);
    this.characteristics = [];
    this.building = new Building(scene);

    // Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (this.status == "building" && pointer.rightButtonDown()) {
        this.events.emit("building-in-progress-right-clicked", this);
      }
    });
  }

  build(units) {
    let isDone = this.building.build(this, units);
    if (isDone) {
      this.scene.counters.maximumPopulation += this.populationIncrease;
    }
    return isDone;
  }

  place() {
    return this.building.place(this);
  }

  destroy() {
    this.building.destroy(this);
    super.destroy(this);
  }

  move(position) {
    this.building.move(this, position);
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
