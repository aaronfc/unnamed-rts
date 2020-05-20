import Phaser from "phaser";

export default class HealthBar extends Phaser.GameObjects.Container {

  constructor(scene, entity) {
    super(scene, entity.x, entity.y - 9, []);
    scene.add.existing(this);
    this.setDepth(100);
    this.visible = true;

    // Properties
    this.scene = scene;
    this.entity = entity;
    this.healthBarWidth = 15;

    // Create all GUI elements
    
    // Background rectangle
    this.backgroundRectangle = scene.add.rectangle(0, 0, this.healthBarWidth, 3, "0xFF0000");
    this.add(this.backgroundRectangle);
    // Health rectangle
    this.healthRectangle = scene.add.rectangle(0, 0, this.healthBarWidth, 3, "0x33BB33");
    this.add(this.healthRectangle);
  }

  update() {
    this.x = this.entity.x;
    this.y = this.entity.y - 9;

    let percentage = this.entity.health / this.entity.initialHealth;
    this.healthRectangle.width = percentage * this.healthBarWidth;
  }
}
