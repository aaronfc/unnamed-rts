const EXPAND_MARGIN = 5;
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

  getData() {
    return this.polygons;
  }

  debugDraw(scene) {
    let graphics = scene.add.graphics();
    graphics.setDepth(1000);
    let colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00, 0x00ffff];
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
        polygonX + polygonW - x + width,
        polygonY + polygonH - y
      )
    );
    subpolygons.push(
      this._generatePolygon(
        polygonX,
        y + height,
        x + width - polygonX,
        polygonY + polygonH - y + height
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

  // Pseudo-code to generate navmesh when adding a new element to the map
  // ⚠️  Not taking into account if the element fits the polygon!
  // element = new Element(x, y, width, height)
  // polygon = mesh.popPolygonForXY(element.x, element.y)
  // subpolygons = createSubpolygons(polygon, element)
  // mesh.append(subpolygons)
}
