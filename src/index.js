import Phaser from "phaser";
import Villager from "./villager.js";
import Resource from "./resource.js";
import TownCenter from "./town_center.js";

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

  // Create Town Center
  var townCenter = new TownCenter(this, 100, 50);
  this.buildings.push(townCenter);

  // Create Adan
  let newPosition = townCenter.getNewVillagerPosition();
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, townCenter));

  // Resource
  var resource = new Resource(this, 200, 200, 100);
  this.resources.push(resource);

  // Input
  this.input.mouse.disableContextMenu();
  this.input.on('pointerdown', (pointer) => {
    if (pointer.rightButtonDown()) {
      this.events.emit('map-right-clicked', pointer);
    } else {
      this.events.emit('map-left-or-middle-clicked', pointer)
    }
  });

  // Events
  this.events.on('resource-destroyed', (resource) => {
    this.resources = this.resources.filter( r => r != resource);
    console.log("Resource destroyed!");
    console.log(this.resources);
  }, this);

  // Physics / Collisions
  this.physics.add.collider(this.villagers, this.villagers);
  this.physics.add.collider(this.villagers, this.buildings);
  this.physics.add.collider(this.villagers, this.resources);
}

function update() {
  this.villagers.forEach( v => v.update());
  this.resources.forEach( r => r.update());
}

