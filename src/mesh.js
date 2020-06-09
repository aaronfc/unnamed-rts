import Phaser from "phaser";

const EXPAND_MARGIN = 5;
const UNOPTIMIZE_SIZE = 500;
export default class Mesh {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    // The mesh is represented as an array where each element contains the points for an indivdual
    // polygon within the mesh.
    this.polygons = [this._generatePolygon(0, 0, this.width, this.height)];
  }

  addEntity(entity) {
    let topleft = entity.getTopLeft();
    this.addElement(
      topleft.x - EXPAND_MARGIN,
      topleft.y - EXPAND_MARGIN,
      entity.width + EXPAND_MARGIN * 2,
      entity.height + EXPAND_MARGIN * 2
    );
  }

  removeEntity(entity) {
    let topleft = entity.getTopLeft();
    this.removeElement(
      topleft.x - EXPAND_MARGIN,
      topleft.y - EXPAND_MARGIN,
      entity.width + EXPAND_MARGIN * 2,
      entity.height + EXPAND_MARGIN * 2
    );
  }

  removeElement(x, y, width, height) {
    let polygon = this._generatePolygon(x, y, width, height);
    this.polygons.push(polygon);
  }

  addElement(x, y, width, height) {
    let inputRectangle = new Phaser.Geom.Rectangle(x, y, width, height);
    let polygons = this._popPolygonsInterestingPolygon(inputRectangle);
    polygons.forEach((polygon) => {
      let intersection = this._getIntersection(
        this._getAsRectangle(polygon),
        inputRectangle
      );
      let subpolygons = this._getSubPolygons(
        polygon,
        intersection.x,
        intersection.y,
        intersection.width,
        intersection.height
      );
      subpolygons.forEach((sp) => this.polygons.push(sp));
    });
  }

  unoptimize() {
    var result = [];
    for (var i = 0; i < this.polygons.length; i++) {
      let currentPolygon = this.polygons[i];
      let currentRectangle = this._getAsRectangle(currentPolygon);
      let horizontalSubpolygons = Math.floor(
        currentRectangle.width / UNOPTIMIZE_SIZE
      );
      let restHorizontal = currentRectangle.width % UNOPTIMIZE_SIZE;
      let verticalSubpolygons = Math.floor(
        currentRectangle.height / UNOPTIMIZE_SIZE
      );
      let restVertical = currentRectangle.height % UNOPTIMIZE_SIZE;

      if (horizontalSubpolygons > 1 || verticalSubpolygons > 1) {
        for (var j = 0; j < horizontalSubpolygons + 1; j++) {
          for (var k = 0; k < verticalSubpolygons + 1; k++) {
            let width =
              j < horizontalSubpolygons ? UNOPTIMIZE_SIZE : restHorizontal;
            let height =
              k < verticalSubpolygons ? UNOPTIMIZE_SIZE : restVertical;
            result.push(
              this._generatePolygon(
                currentRectangle.x + j * UNOPTIMIZE_SIZE,
                currentRectangle.y + k * UNOPTIMIZE_SIZE,
                width,
                height
              )
            );
          }
        }
      } else {
        result.push(currentPolygon);
      }
    }
    this.polygons = result;
  }

  getData() {
    return this.polygons;
  }

  debugDraw(scene) {
    let graphics = scene.add.graphics();
    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, 25, 25);
    graphics.setDepth(1000);
    let colors = [
      0xe6194b,
      0x3cb44b,
      0xffe119,
      0x4363d8,
      0xf58231,
      0x911eb4,
      0x46f0f0,
      0xf032e6,
      0xbcf60c,
      0xfabebe,
      0x008080,
      0xe6beff,
      0x9a6324,
      0xfffac8,
      0x800000,
      0xaaffc3,
      0x808000,
      0xffd8b1,
      0x000075,
      0x808080,
      0xffffff,
      0x000000,
    ];
    let i = 0;
    this.polygons.forEach((p) => {
      graphics.fillStyle(colors[i % colors.length], 0.3);
      graphics.fillRect(p[0].x, p[0].y, p[2].x - p[0].x, p[2].y - p[0].y);
      graphics.fillRect(p[0].x, p[0].y, p[2].x - p[0].x, p[2].y - p[0].y);
      scene.add
        .text(
          p[0].x + (p[2].x - p[0].x) / 2,
          p[0].y + (p[2].y - p[0].y) / 2,
          `${i}`,
          {
            color: "#000000",
            fontSize: 14,
          }
        )
        .setOrigin(0.5)
        .setDepth(1000);
      i += 1;
    });
  }

  clean() {
    this.polygons = [this._generatePolygon(0, 0, this.width, this.height)];
  }

  // Private methods

  _popPolygonsInterestingPolygon(inputRectangle) {
    let matching = this.polygons.filter(
      (p) =>
        !this._getIntersection(
          inputRectangle,
          this._getAsRectangle(p)
        ).isEmpty()
    );
    this.polygons = this.polygons.filter((p) => !matching.includes(p));
    return matching;
  }

  _getAsRectangle(polygon) {
    let x = polygon[0].x;
    let y = polygon[0].y;
    let width = polygon[2].x - polygon[0].x;
    let height = polygon[2].y - polygon[0].y;
    return new Phaser.Geom.Rectangle(x, y, width, height);
  }

  _getIntersection(rectangle1, rectangle2) {
    return Phaser.Geom.Rectangle.Intersection(rectangle1, rectangle2);
  }

  _generatePolygon(x, y, width, height) {
    return [
      { x: x, y: y },
      { x: x + width, y: y },
      { x: x + width, y: y + height },
      { x: x, y: y + height },
    ];
  }

  _getSubPolygons(polygon, x, y, width, height) {
    var subpolygons = [];
    let polygonX = polygon[0].x;
    let polygonY = polygon[0].y;
    let polygonW = polygon[2].x - polygon[0].x;
    let polygonH = polygon[2].y - polygon[0].y;

    let top = this._generatePolygon(
      x,
      polygonY,
      polygonX + polygonW - x,
      y - polygonY
    );
    if (top[2].x - top[0].x > 0 && top[2].y - top[0].y > 0) {
      subpolygons.push(top);
    }

    let right = this._generatePolygon(
      x + width,
      y,
      polygonX + polygonW - x - width,
      polygonY + polygonH - y
    );
    if (right[2].x - right[0].x > 0 && right[2].y - right[0].y > 0) {
      subpolygons.push(right);
    }
    let bottom = this._generatePolygon(
      polygonX,
      y + height,
      x + width - polygonX,
      polygonY + polygonH - y - height
    );
    if (bottom[2].x - bottom[0].x > 0 && bottom[2].y - bottom[0].y > 0) {
      subpolygons.push(bottom);
    }
    let left = this._generatePolygon(
      polygonX,
      polygonY,
      x - polygonX,
      y + height - polygonY
    );
    if (left[2].x - left[0].x > 0 && left[2].y - left[0].y > 0) {
      subpolygons.push(left);
    }

    return subpolygons;
  }
}
