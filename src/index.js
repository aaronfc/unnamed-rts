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
  var newPosition = new Phaser.Math.Vector2(
    townCenter.x + townCenter.width + 10,
    townCenter.y + townCenter.height + 10
  );
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, townCenter));

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

