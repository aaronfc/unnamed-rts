import Phaser from "phaser";
import Villager from "./villager.js";
import Resource from "./resource.js";
import TownCenter from "./town_center.js";
import GUI from "./gui.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { x: 0, y: 0}
    }
  },
  width: 916, // This is the real size in pixels of half my screen so that we do not have blurry text after 100% width resize in index.html
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  backgroundColor: "#FFFFFF"
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('villager-icon', 'assets/villager-icon.png');
  this.load.image('resource-icon', 'assets/resource-icon.png');
  this.load.image('time-icon', 'assets/time-icon.png');
}

function create() {

  this.counters = {
    villagers: 0,
    gameTime: 0,
    resource: 100,
  };
  this.gui = new GUI(this, this.sys.game.canvas.width - 270, 10, this.counters);
  this.villagers = [];
  this.buildings = [];
  this.resources = [];

  // Create Town Center
  var townCenter = new TownCenter(this, 100, 50);
  this.buildings.push(townCenter);

  // Create Adan and Eva
  let newPosition = townCenter.getNewVillagerPosition();
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, townCenter));
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, townCenter));

  // Resource
  var resource = new Resource(this, 200, 200, 1000);
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
  }, this);
  this.events.on('new-villager-created', (villager) => {
    this.counters.villagers += 1;
  }, this);
  this.events.on('resource-deposit-increased', (amount) => {
    this.counters.resource += amount;
  }, this);

  // Testing movement
  //for (var i=1; i< 20; i++) {
  //  this.villagers.push(new Villager(this, 100+i*11, 100, townCenter));
  //  this.villagers[i].startCollectingResource(this.resources[0]);
  //}
}

function update(time, delta) {
  this.counters.gameTime = Math.floor(time/1000);
  this.counters.villagers = this.villagers.length;
  this.villagers.forEach( v => v.update());
  this.buildings.forEach( b => b.update());
  this.resources.forEach( r => r.update());
  this.gui.update();
}
