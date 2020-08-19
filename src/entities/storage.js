import TiledGameObject from "../tiled-game-object.js";
import Storing from "../behaviours/storing.js";
import Building from "../behaviours/building.js";

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
    this.storing = new Storing(scene);
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
    return this.building.build(this, units);
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

  deposit(amount) {
    this.storing.deposit(amount);
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
