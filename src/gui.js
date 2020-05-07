import Phaser from "phaser";

export default class GUI extends Phaser.GameObjects.Container {

  constructor(scene, x, y, counters) {
    // Rectangle
    super(scene, x, y, []);
    scene.add.existing(this);
    this.setDepth(999);

    // Properties
    this.counters = counters;
    this.scene = scene;

    // Create all GUI elements
    
    // Background (rectangle)
    this.backgroundRectangle = scene.add.rectangle(0, 0, 250, 34, "0x2F3337")
      .setOrigin(0)
      .setAlpha(0.5);
    this.add(this.backgroundRectangle);

    // Villagers info
    this.villagersIcon = scene.add.image(10, 10, 'villager-icon')
      .setOrigin(0)
      .setScale(0.03);
    this.add(this.villagersIcon);
    this.villagersText = scene.add.text(this.villagersIcon.x + this.villagersIcon.displayWidth + 5, 10, '???', {color: '#FFFFFF', fontSize: 14}),
    this.add(this.villagersText);

    // Resource info
    this.resourceIcon = scene.add.image(this.villagersText.x + this.villagersText.displayWidth + 20, this.villagersIcon.y, 'resource-icon')
      .setOrigin(0)
      .setScale(0.03);
    this.add(this.resourceIcon);
    this.resourceText = scene.add.text(this.resourceIcon.x + this.resourceIcon.displayWidth +  5, this.resourceIcon.y, '?????', {color: '#FFFFFF', fontSize: 14}),
    this.add(this.resourceText);

    // Time info
    this.gameTimeText = scene.add.text(this.resourceText.x + this.resourceText.displayWidth + 20, this.resourceText.y, '⏰ ??:??:??', {color: '#FFFFFF', fontSize: 14}),
    this.add(this.gameTimeText);
  }

  update() {
    this.villagersText.setText(this._formatVillagersCount());
    this.resourceText.setText(this._formatResourceCount());
    this.gameTimeText.setText("⏰" + this._formatGameTime());

  }

  // Private methods
  
  _formatVillagersCount() {
    return this.counters.villagers.toString().padStart(3, "0");
  }

  _formatResourceCount() {
    return this.counters.resource.toString().padStart(5, "0");
  }

  _formatGameTime() {
    return new Date(this.counters.gameTime * 1000).toISOString().substr(11, 8);
  }
}
