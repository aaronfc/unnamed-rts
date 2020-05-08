import Phaser from "phaser";
import Villager from "./villager.js";
import Resource from "./resource.js";
import TownCenter from "./town_center.js";
import GUI from "./gui.js";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
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
}

function create() {

  this.counters = {
    villagers: 0,
    gameTime: 0,
    resource: 0,
  };
  this.gui = new GUI(this, this.sys.game.canvas.width - 270, 10, this.counters);
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

  // Physics / Collisions
  this.physics.add.collider(this.villagers, this.villagers);
  this.physics.add.collider(this.villagers, this.buildings);
  this.physics.add.collider(this.villagers, this.resources);

  // Testing movement
  for (var i=1; i< 20; i++) {
    this.villagers.push(new Villager(this, 100+i*11, 100, townCenter));
    this.villagers[i].startCollectingResource(this.resources[0]);
  }

  //this.villagers[1].body.setVelocity(-100, 0);
  //this.villagers[1].moveToPosition({x: 200, y: 300});
  //this.villagers[2].body.setVelocity(-500, 0);
}

function update(time, delta) {
  this.counters.gameTime = Math.floor(time/1000);
  this.villagers.forEach( v => v.update());
  this.resources.forEach( r => r.update());
  //this.gui.setText(formatGuiText(this.counters));
  this.gui.update();
}

function formatGuiText(counters) {
  return 'resource: ' + counters.resource + ' \n'
      + 'villagers: ' + counters.villagers + ' \n'
      + 'game time: ' + counters.gameTime + 's';
}
