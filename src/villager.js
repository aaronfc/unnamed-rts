import Phaser from "phaser";

export default class Villager extends Phaser.GameObjects.Arc {

  constructor(scene, x, y) {
    // Circle
    super(scene, x, y, 5, 0, 360, false, "0x0000FF", 1);
    scene.add.existing(this);

    // Properties
    this.selected = false;
    this.destination = new Phaser.Math.Vector2(x, y);

    // Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      this.selected = !this.selected;
      event.stopPropagation();
    });
  }

  preUpdate() {
  }

  update() {
    // Selection
    if (this.selected) {
      this.setStrokeStyle(1, "0xFF0000");
    } else {
      this.setStrokeStyle(0);
    }
    // Movement
    var villagerDistanceToDestinationX = Math.abs(this.destination.x - this.x);
    var villagerDistanceToDestinationY = Math.abs(this.destination.y - this.y);
    if (villagerDistanceToDestinationX > 1) {
      this.x += this.destination.x > this.x ? 1 : -1;
    }
    if (villagerDistanceToDestinationY > 1) {
      this.y += this.destination.y > this.y ? 1 : -1;
    }
  }

}
