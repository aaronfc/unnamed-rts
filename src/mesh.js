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

  addElement(x, y, width, height) {
    let polygon = this._popPolygonForPosition(x, y);
    let subpolygons = this._getSubPolygons(polygon, x, y, width, height);
    subpolygons.forEach((sp) => this.polygons.push(sp));
  }

  unoptimize() {
    var result = [];
    for (var i = 0; i < this.polygons.length; i++) {
      let current = this.polygons[i];
      let currentX = this._getX(current);
      let currentY = this._getY(current);
      let currentHeight = this._getHeight(current);
      let currentWidth = this._getWidth(current);
      let horizontalSubpolygons = Math.floor(currentWidth / UNOPTIMIZE_SIZE);
      let restHorizontal = currentWidth % UNOPTIMIZE_SIZE;
      let verticalSubpolygons = Math.floor(currentHeight / UNOPTIMIZE_SIZE);
      let restVertical = currentHeight % UNOPTIMIZE_SIZE;

      if (horizontalSubpolygons > 1 || verticalSubpolygons > 1) {
        for (var j = 0; j < horizontalSubpolygons + 1; j++) {
          for (var k = 0; k < verticalSubpolygons + 1; k++) {
            let width =
              j < horizontalSubpolygons ? UNOPTIMIZE_SIZE : restHorizontal;
            let height =
              k < verticalSubpolygons ? UNOPTIMIZE_SIZE : restVertical;
            result.push(
              this._generatePolygon(
                currentX + j * UNOPTIMIZE_SIZE,
                currentY + k * UNOPTIMIZE_SIZE,
                width,
                height
              )
            );
          }
        }
      } else {
        result.push(current);
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
        .text(p[0].x, p[0].y, `${i}`, {
          color: "#000000",
          fontSize: 14,
        })
        .setOrigin(0)
        .setDepth(1000);
      i += 1;
    });
  }

  clean() {
    this.polygons = [this._generatePolygon(0, 0, this.width, this.height)];
  }

  _getX(polygon) {
    return polygon[0].x;
  }
  _getY(polygon) {
    return polygon[0].y;
  }
  _getWidth(polygon) {
    return polygon[2].x - polygon[0].x;
  }
  _getHeight(polygon) {
    return polygon[2].y - polygon[0].y;
  }

  _popPolygonForPosition(x, y) {
    let polygon = this.polygons.find(
      (p) => x >= p[0].x && x <= p[2].x && y >= p[0].y && y <= p[2].y
    );
    this.polygons = this.polygons.filter((p) => p != polygon);
    return polygon;
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

    subpolygons.push(
      this._generatePolygon(x, polygonY, polygonX + polygonW - x, y - polygonY)
    );
    subpolygons.push(
      this._generatePolygon(
        x + width,
        y,
        polygonX + polygonW - x - width,
        polygonY + polygonH - y
      )
    );
    subpolygons.push(
      this._generatePolygon(
        polygonX,
        y + height,
        x + width - polygonX,
        polygonY + polygonH - y - height
      )
    );
    subpolygons.push(
      this._generatePolygon(
        polygonX,
        polygonY,
        x - polygonX,
        y + height - polygonY
      )
    );

    return subpolygons;
  }
}
