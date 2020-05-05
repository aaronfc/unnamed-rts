
import Phaser from "phaser";
import Villager from "./villager.js";

export default class TownCenter extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y) {
    // Create resource mine
    super(scene, x, y, 100, 50, "0x0000FF");
    scene.add.existing(this);
    scene.physics.add.existing(this, 1); // This needs to happen after positioning the object. If not we need to call the .refreshBody() method.

    // Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      var newPosition = this.getNewVillagerPosition();
      // TODO Maybe remove this reference to scene's villagers array and also dependency on Villager entity.
      scene.villagers.push(new Villager(scene, newPosition.x, newPosition.y, this));
      event.stopPropagation();
    });
  }

  update() {
  }

  getNewVillagerPosition() {
    return new Phaser.Math.Vector2(
      this.x + this.width/2+ 10,
      this.y + this.height/2 + 10
    );
  }
}
