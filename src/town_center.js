
import Phaser from "phaser";
import Villager from "./villager.js";

export default class TownCenter extends Phaser.GameObjects.Rectangle {

  constructor(scene, x, y) {
    // Create resource mine
    super(scene, x, y, 100, 50, "0x0000FF");
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setStatic(true);

    // Properties
    this.events = scene.events;

    // Events
    this.setInteractive();
    this.on('pointerdown', (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        var newPosition = this.getNewVillagerPosition();
        // TODO Maybe remove this reference to scene's villagers array and also dependency on Villager entity.
        let newVillager = new Villager(scene, newPosition.x, newPosition.y, this);
        scene.villagers.push(newVillager);
        this.events.emit('new-villager-created', newVillager);
        event.stopPropagation();
      }
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

  deposit(amount) {
    this.events.emit('resource-deposit-increased', amount, this);
  }
}
