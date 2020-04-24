import Phaser from "phaser";
import Villager from "./villager.js";
import Resource from "./resource.js";

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
  var mainBuilding = this.add.rectangle(50, 50, 100, 50, "0x0000FF");
  mainBuilding.setOrigin(0,0);
  mainBuilding.setInteractive();
  mainBuilding.on('pointerdown', (pointer, localX, localY, event) => {
    var newPosition = new Phaser.Math.Vector2(
      mainBuilding.x + mainBuilding.width + 10,
      mainBuilding.y + mainBuilding.height + 10
    );
    this.villagers.push(new Villager(this, newPosition.x, newPosition.y, mainBuilding));
    event.stopPropagation();
  });

  // Create Adan
  var newPosition = new Phaser.Math.Vector2(
    mainBuilding.x + mainBuilding.width + 10,
    mainBuilding.y + mainBuilding.height + 10
  );
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, mainBuilding));

  // Resource
  var resource = new Resource(this, 200, 200);

  // Input
  this.input.mouse.disableContextMenu();
  this.input.on('pointerdown', (pointer) => {
    this.events.emit('map-right-clicked', pointer);
  });
}

function update() {
  this.villagers.forEach( v => v.update());
}

