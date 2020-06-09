import Phaser from "phaser";
import Mesh from "../mesh.js";

const MAP_WIDTH = 500;
const MAP_HEIGHT = 500;

export default class MeshTesting extends Phaser.Scene {
  constructor() {
    super("MeshTesting");
  }

  create() {
    this.mesh = new Mesh(MAP_WIDTH, MAP_HEIGHT);

    // Same horizontal position ✔️
    this.mesh.addElement(25, 25, 50, 50);
    this.mesh.addElement(50, 300, 50, 50);
    // One touching the other ✔️
    this.mesh.addElement(75, 75, 50, 50);
    // One entity overriding some full polygons ✔️
    this.mesh.addElement(300, 300, 10, 10);
    this.mesh.addElement(320, 300, 10, 10);
    this.mesh.addElement(310, 300, 10, 10);
    // Remove element ✔️
    this.mesh.addElement(300, 100, 50, 50);
    this.mesh.removeElement(300, 100, 50, 50);

    // Draw navigational mesh for debugging
    this.mesh.debugDraw(this);

    console.log(this.mesh.getData());
  }

  update(time, delta) {}
}
