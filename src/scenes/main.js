import Phaser from "phaser";
import Villager from "../entities/villager.js";
import Resource from "../entities/resource.js";
import TownCenter from "../entities/town_center.js";
import Enemy from "../entities/enemy.js";
import Map from "../entities/map.js";

const MAP_WIDTH = 2 * 1080;
const MAP_HEIGHT = 2 * 720;
const INITIAL_ENEMIES = 0;
const ENEMY_WAVES_INCREASE = 1;
const ENEMY_WAVES_INTERVAL = 60000; // 1 minute
const EXTRA_RESOURCES = 5;
const ZOOM_LEVELS = [0.5, 1, 2];
const DEFAULT_ZOOM_LEVEL_INDEX = 1; // Second position

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("villager-icon", "assets/villager-icon.png");
  }

  create() {
    this.initialTime = this.time.now;
    this.counters = {
      villagers: 0,
      gameTime: 0,
      resource: 100,
    };
    this.villagers = [];
    this.buildings = [];
    this.resources = [];
    this.enemies = [];
    this.isGameOver = false;
    this.nextWaveTime = this.time.now + ENEMY_WAVES_INTERVAL;
    this.enemiesNextWave = 1;
    this.zoomLevel = DEFAULT_ZOOM_LEVEL_INDEX;

    // World boders
    this.matter.world.setBounds(
      0,
      0,
      MAP_WIDTH,
      MAP_HEIGHT,
      64,
      true,
      true,
      true,
      true
    );
    this.map = new Map(this, MAP_WIDTH, MAP_HEIGHT);

    // Camera control
    var cursors = this.input.keyboard.addKeys("W,S,A,D");
    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.A,
      right: cursors.D,
      up: cursors.W,
      down: cursors.S,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      zoomSpeed: 0.25,
      acceleration: 1,
      drag: 1,
      maxSpeed: 1.0,
    };
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
      controlConfig
    );
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 1)");
    this.cameras.main.setBounds(-100, -100, MAP_WIDTH + 200, MAP_HEIGHT + 200);

    // Create Town Center
    var townCenter = new TownCenter(this, 100, 50);
    this.buildings.push(townCenter);

    // Create Adan and Eva
    let newPosition = townCenter.getNewVillagerPosition();
    this.villagers.push(
      new Villager(this, newPosition.x, newPosition.y, townCenter)
    );
    //this.villagers.push(new Villager(this, newPosition.x, newPosition.y, townCenter));

    // Create bad guy
    let newBadGuyPosition = { x: 300, y: 300 };
    for (var i = 0; i < INITIAL_ENEMIES; i++) {
      this.enemies.push(new Enemy(this, newBadGuyPosition));
    }

    // Resource
    var resource = new Resource(this, { x: 200, y: 200 }, 1000);
    this.resources.push(resource);
    for (var i = 0; i < EXTRA_RESOURCES; i++) {
      this.resources.push(new Resource(this, this._randomPosition(), 1000));
    }

    // Input
    this.input.mouse.disableContextMenu();
    this.input.on("pointerdown", (pointer) => {
      if (pointer.rightButtonDown()) {
        this.events.emit("map-right-clicked", pointer);
      } else {
        this.events.emit("map-left-or-middle-clicked", pointer);
      }
    });

    // Zooming by using mouse wheel
    this.input.on("wheel", (pointer, object, dx, dy, dz) => {
      // Calculate mouse offset from the center of the viewport
      let mouseOffset = {
        x: pointer.x - this.cameras.main.centerX,
        y: pointer.y - this.cameras.main.centerY,
      };
      let worldCoordinates = {
        x: pointer.worldX,
        y: pointer.worldY,
      };

      // Calculate zoom increase: 1 when scrolling UP, -1 when scrolling DOWN, 0 otherwise
      let zoomIncrease = dy < 0 ? 1 : dy > 0 ? -1 : 0;
      this._changeZoomLevel(zoomIncrease, worldCoordinates, mouseOffset);

      // Preventing propagation of the event so that the page doesn't move
      pointer.event.preventDefault();
    });

    // Events
    this.events.on(
      "resource-destroyed",
      (resource) => {
        this.resources = this.resources.filter((r) => r != resource);
      },
      this
    );
    this.events.on(
      "new-villager-created",
      (villager) => {
        this.villagers.push(villager);
      },
      this
    );
    this.events.on(
      "resource-deposit-increased",
      (amount) => {
        this.counters.resource += amount;
      },
      this
    );
    this.events.on(
      "villager-died",
      (villager) => {
        this.villagers = this.villagers.filter((v) => v != villager);
      },
      this
    );
    this.events.on(
      "enemy-died",
      (enemy) => {
        this.enemies = this.enemies.filter((e) => e != enemy);
      },
      this
    );

    // Update counters so that they are consistent
    this.counters.villagers = this.villagers.length;

    // Update camera
    this.cameras.main.setZoom(ZOOM_LEVELS[this.zoomLevel]);
  }

  update(time, delta) {
    // Enemies creation
    if (this.nextWaveTime <= this.time.now) {
      this._generateEnemiesWave();
      this.nextWaveTime = this.time.now + ENEMY_WAVES_INTERVAL;
    }

    // Game Over
    if (!this.isGameOver) {
      this.counters.gameTime = (this.time.now - this.initialTime) / 1000; // TODO Implement this in a proper way
      this.counters.villagers = this.villagers.length;
      this.villagers.forEach((v) => v.update());
      this.buildings.forEach((b) => b.update());
      this.resources.forEach((r) => r.update());
      this.enemies.forEach((e) => e.update());

      if (this.counters.villagers <= 0) {
        this.isGameOver = true;
        this.time.removeAllEvents();
      }

      this.controls.update(delta);
    }
  }

  // Private methods

  _changeZoomLevel(increase, position, offset) {
    this.zoomLevel = Phaser.Math.Clamp(
      this.zoomLevel + increase,
      0,
      ZOOM_LEVELS.length - 1
    );
    let futureZoom = ZOOM_LEVELS[this.zoomLevel];
    if (this.cameras.main.zoom != futureZoom) {
      let offsetXCorrected = offset.x / futureZoom;
      let offsetYCorrected = offset.y / futureZoom;
      this.cameras.main.setZoom(ZOOM_LEVELS[this.zoomLevel]);
      this.cameras.main.centerOn(
        position.x - offsetXCorrected,
        position.y - offsetYCorrected
      );
    }
  }

  _generateEnemiesWave() {
    let randomPosition = this._randomPosition();
    for (var i = 0; i < this.enemiesNextWave; i++) {
      // create random enemy
      this.enemies.push(new Enemy(this, randomPosition));
    }
    this.enemiesNextWave += ENEMY_WAVES_INCREASE;
  }

  _randomInt(min, max) {
    return Math.random() * (max - min) + min;
  }

  _randomPosition() {
    return {
      x: this._randomInt(300, MAP_WIDTH),
      y: this._randomInt(300, MAP_HEIGHT),
    };
  }
}
