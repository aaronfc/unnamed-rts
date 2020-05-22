import Phaser from "phaser";
import Villager from "./villager.js";
import Resource from "./resource.js";
import TownCenter from "./town_center.js";
import Enemy from "./enemy.js";
import GUI from "./gui.js";
import GameOverScreen from "./gameover-screen.js";

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
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
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
  this.gameoverScreen = new GameOverScreen(this, this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, this.counters);
  this.villagers = [];
  this.buildings = [];
  this.resources = [];
  this.enemies = [];
  this.isGameOver = false;

  // Create Town Center
  var townCenter = new TownCenter(this, 100, 50);
  this.buildings.push(townCenter);

  // Create Adan and Eva
  let newPosition = townCenter.getNewVillagerPosition();
  this.villagers.push(new Villager(this, newPosition.x, newPosition.y, townCenter));

  // Create bad guy
  let newBadGuyPosition = {x: 500, y: 500};
  this.enemies.push(new Enemy(this, newBadGuyPosition.x, newBadGuyPosition.y));

  // Resource
  var resource = new Resource(this, 200, 200, 1000);
  this.resources.push(resource);

  // Enemies creation
  this.enemiesNextWave = 1;
  this.scheduleNextWave = () => {
    this.time.addEvent({
      delay: 60*1000, // Enemies appear every 1 minute
      callback: () => {
        for(var i=0; i<this.enemiesNextWave; i++ ) {
          // create random enemy
          let randomPosition = {x: _randomInt(0, 500), y: _randomInt(0, 500)};
          this.enemies.push(new Enemy(this, randomPosition.x, randomPosition.y));
        }
        this.enemiesNextWave += 1;
        this.scheduleNextWave();
      },
      callbackScope: this
    });
  }
  this.scheduleNextWave();


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
    this.villagers.push(villager);
  }, this);
  this.events.on('resource-deposit-increased', (amount) => {
    this.counters.resource += amount;
  }, this);
  this.events.on('villager-died', (villager) => {
      this.villagers = this.villagers.filter(v => v != villager);
  }, this);
  this.events.on('enemy-died', (enemy) => {
      this.enemies = this.enemies.filter(e => e != enemy);
  }, this);

  // Testing movement
  //for (var i=1; i< 20; i++) {
  //  this.villagers.push(new Villager(this, 100+i*11, 100, townCenter));
  //  this.villagers[i].startCollectingResource(this.resources[0]);
  //}
}

function update(time, delta) {
  if (!this.isGameOver) {
    this.counters.gameTime += delta/1000; // TODO Implement this in a proper way
    this.counters.villagers = this.villagers.length;
    this.villagers.forEach( v => v.update());
    this.buildings.forEach( b => b.update());
    this.resources.forEach( r => r.update());
    this.enemies.forEach( e => e.update());
    this.gui.update();

    if (this.counters.villagers <= 0) {
      this.isGameOver = true;
      this.gameoverScreen.show();
      this.time.removeAllEvents();
    }
  }

}

function _randomInt(min, max) {
  return Math.random() * (max - min) + min;
}
