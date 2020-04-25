import Phaser from "phaser";
import Villager from "./villager.js";
import Resource from "./resource.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
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
  this.buildings = [];
  this.resources = [];

  // Create main building
  var mainBuilding = this.add.rectangle(100, 50, 100, 50, "0x0000FF");
  this.physics.add.existing(mainBuilding, 1); // This needs to happen after positioning the object. If not we need to call the .refreshBody() method.
  mainBuilding.setInteractive();
  mainBuilding.on('pointerdown', (pointer, localX, localY, event) => {
    var newPosition = new Phaser.Math.Vector2(
      mainBuilding.x + mainBuilding.width + 10,
      mainBuilding.y + mainBuilding.height + 10
    );
    this.villagers.push(new Villager(this, newPosition.x, newPosition.y, mainBuilding));
    event.stopPropagation();
  });
  this.buildings.push(mainBuilding);

  // Create Adan
  var newPosition = new Phaser.Math.Vector2(
    mainBuilding.x + mainBuilding.width + 10,
    mainBuilding.y + mainBuilding.height + 10
  );
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, mainBuilding));

  // Resource
  var resource = new Resource(this, 200, 200);
  this.resources.push(resource);

  // Input
  this.input.mouse.disableContextMenu();
  this.input.on('pointerdown', (pointer) => {
    this.events.emit('map-right-clicked', pointer);
  });

  // Physics / Collisions
  this.physics.add.collider(this.villagers, this.villagers);
  this.physics.add.collider(this.villagers, this.buildings);
  this.physics.add.collider(this.villagers, this.resources);
}

function update() {
  this.villagers.forEach( v => v.update());
}

