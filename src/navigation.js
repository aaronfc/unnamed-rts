import Mesh from "./mesh.js";
import NavMesh from "navmesh/src";

export default class Navigation {
  constructor(scene, map) {
    this.scene = scene;
    this.map = map;
    this.mesh = new Mesh(map.width, map.height);
    this.navmesh = null;
  }

  regenerate() {
    this.mesh.clean();
    this.map.buildings.forEach((b) => this.mesh.addEntity(b));
    this.map.resources.forEach((r) => this.mesh.addEntity(r));
    this.mesh.unoptimize();
    this.navmesh = new NavMesh(this.mesh.getData(), 5); // TODO Update navmesh and not just override it
  }

  findPath(fromPosition, toPosition) {
    return this.navmesh.findPath(fromPosition, toPosition);
  }

  drawDebug() {
    this.mesh.debugDraw(this.scene);
  }
}
