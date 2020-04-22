import Phaser from "phaser";
import Villager from "./villager.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  backgroundColor: "#FFFFFF"
};

const game = new Phaser.Game(config);

function preload() {}

function create() {

  this.villagers = [];

  // Create main building
  var mainBuilding = this.add.rectangle(0, 0, 100, 50, "0x0000FF");
  mainBuilding.setOrigin(0,0);
  mainBuilding.setInteractive();
  mainBuilding.on('pointerdown', (pointer, localX, localY, event) => {
    var newPosition = new Phaser.Math.Vector2(
      mainBuilding.x + mainBuilding.width + 10,
      mainBuilding.y + mainBuilding.height + 10
    );
    this.villagers.push(new Villager(this, newPosition.x, newPosition.y));
    event.stopPropagation();
  });

  // Create Adan
  var newPosition = new Phaser.Math.Vector2(
    mainBuilding.x + mainBuilding.width + 10,
    mainBuilding.y + mainBuilding.height + 10
  );
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y));

  // Create resource mine
  var resourceMine = this.add.rectangle(400, 400, 30, 30, "0xFF00FF");
  resourceMine.setOrigin(0,0);
  resourceMine.setInteractive();
  resourceMine.on('pointerdown', (pointer, localX, localY, event) => {
    var isRightClick = pointer.button == 2;
    var selectedVillagers = this.villagers.filter(v => v.selected);
    if (selectedVillagers.length > 0 && isRightClick) {
      selectedVillagers.forEach(villager => {
        villager.destination = new Phaser.Math.Vector2(resourceMine.x, resourceMine.y)
        villager.selected = false;
      });
    }
    event.stopPropagation();
  });

  // Input
  this.input.mouse.disableContextMenu();
  this.input.on('pointerdown', (pointer) => {

    // For any selected villager
    // TODO: Improve performance on this. Instead of iterating over all villagers, have a separate variable
    // with the selected villagers. They can be appended themselves upon click.
    this.villagers.filter(v => v.selected)
      .forEach( v => {
        if (pointer.rightButtonDown()) {
          v.destination = new Phaser.Math.Vector2(pointer.x, pointer.y);
          v.selected = false;
        }
        if (pointer.leftButtonDown()) {
          v.selected = false;
        }
      });
    });
}

function update() {
  this.villagers.forEach( v => v.update());
}

