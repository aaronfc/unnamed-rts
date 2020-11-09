import Phaser from "phaser";
import Villager from "../entities/villager.js";
import Resource from "../entities/resource.js";
import TownCenter from "../entities/town_center.js";
import Enemy from "../entities/enemy.js";
import Tower from "../entities/tower.js";
import Map from "../entities/map.js";
import Navigation from "../navigation.js";

const TILE_SIZE = 16;
const MAP_WIDTH_TILES = 150;
const MAP_HEIGHT_TILES = 100;
const MAP_WIDTH = MAP_WIDTH_TILES * TILE_SIZE;
const MAP_HEIGHT = MAP_HEIGHT_TILES * TILE_SIZE;
const INITIAL_VILLAGERS = 5;
const INITIAL_ENEMIES = 1;
const ENEMY_WAVES_INCREASE = 1;
const ENEMY_WAVES_INTERVAL = 60000; // 1 minute
const EXTRA_RESOURCES = 50;
const ZOOM_LEVELS = [1, 2, 3];
const DEFAULT_ZOOM_LEVEL_INDEX = 1; // Second position
const INITIAL_MAXIMUM_POPULATION = 20;
const INITIAL_RESOURCE = 100;

const DEBUG_NAVIGATION = false;
const DEBUG_INPUT = false;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  create() {
    this.initialTime = this._getNowTime();
    this.counters = {
      villagers: 0,
      maximumPopulation: INITIAL_MAXIMUM_POPULATION,
      gameTime: 0,
      resource: INITIAL_RESOURCE,
    };
    this.villagers = [];
    this.enemies = [];
    this.selectedVillagers = [];
    this.isGameOver = false;
    this.nextWaveTime = this._getNowTime() + ENEMY_WAVES_INTERVAL;
    this.isNextWaveAlerted = false;
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
    this.map = new Map(this, MAP_WIDTH_TILES, MAP_HEIGHT_TILES, TILE_SIZE);

    // Navigation
    this.navigation = new Navigation(this, this.map);

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
    townCenter.status = "built";
    this.map.addBuilding(townCenter);

    // Semi-built house
    //var house = new House(this, 300, 50);
    //house.status = "building";
    //this.map.addBuilding(house);

    // Built tower
    var tower = new Tower(this, 300, 50);
    tower.build(50); // Build to 100% by passing the total units needed
    this.map.addBuilding(tower);

    // Create initial villagers
    let newPosition = townCenter.getNewVillagerPosition();
    for (var i = 0; i < INITIAL_VILLAGERS; i++) {
      this.villagers.push(
        new Villager(this, newPosition.x, newPosition.y, townCenter)
      );
    }

    // Create initial enemies
    let newBadGuyPosition = { x: 300, y: 300 };
    for (var i = 0; i < INITIAL_ENEMIES; i++) {
      this.enemies.push(new Enemy(this, newBadGuyPosition));
    }

    // Resources
    this.map.addResource(new Resource(this, { x: 200, y: 200 }, 100));
    this.map.addResource(new Resource(this, { x: 216, y: 200 }, 100));
    this.map.addResource(new Resource(this, { x: 232, y: 200 }, 100));
    this.map.addResource(new Resource(this, { x: 200, y: 216 }, 100));
    this.map.addResource(new Resource(this, { x: 216, y: 216 }, 100));
    this.map.addResource(new Resource(this, { x: 232, y: 216 }, 100));
    for (var i = 0; i < EXTRA_RESOURCES; i++) {
      let resource = new Resource(this, this._randomPosition(), 1000);
      this.map.addResource(resource);
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
        this.map.onResourceDestroyed(resource);
        this.navigation.regenerate();
      },
      this
    );
    this.events.on(
      "building-destroyed",
      (building) => {
        this.map.onBuildingDestroyed(building);
        this.navigation.regenerate();
      },
      this
    );
    this.events.on(
      "new-villager-created",
      (villager) => {
        this.villagers.push(villager);
        this.counters.villagers = this.villagers.length;
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
    this.events.on(
      "new-villager-selected",
      (villager) => {
        this.selectedVillagers.push(villager); // TODO Beware we might add duplicated villagers
      },
      this
    );
    this.events.on(
      "villager-unselected",
      (villager) => {
        this.selectedVillagers = this.selectedVillagers.filter(
          (v) => v != villager
        );
      },
      this
    );

    // Update counters so that they are consistent
    this.counters.villagers = this.villagers.length;

    // Update camera
    this.cameras.main.setZoom(ZOOM_LEVELS[this.zoomLevel]);

    // Update navigation
    this.navigation.regenerate();

    // Draw navigational mesh for debugging
    if (DEBUG_NAVIGATION) {
      this.navigation.drawDebug();
    }

    if (DEBUG_INPUT) {
      this.input.on("pointermove", (pointer, object) => {
        console.log(pointer, object);
      });
    }
  }

  update(time, delta) {
    // Enemies creation
    if (
      this.nextWaveTime - 10000 <= this._getNowTime() &&
      !this.isNextWaveAlerted
    ) {
      this.scene
        .get("UIScene")
        .events.emit("alert-message", "Next wave is coming in 10 seconds!");
      this.isNextWaveAlerted = true;
    }
    if (this.nextWaveTime <= this._getNowTime()) {
      this._generateEnemiesWave();
      this.nextWaveTime = this._getNowTime() + ENEMY_WAVES_INTERVAL;
      this.isNextWaveAlerted = false;
    }

    // Game Over
    if (!this.isGameOver) {
      this.counters.gameTime = (this._getNowTime() - this.initialTime) / 1000; // TODO Implement this in a proper way
      this.counters.villagers = this.villagers.length;
      this.villagers.forEach((v) => v.update());
      this.enemies.forEach((e) => e.update());
      this.map.update();

      if (this.counters.villagers <= 0) {
        let currentSurvival = this.counters.gameTime;
        let longestSurvival =
          window.localStorage.getItem("longest_survival") || currentSurvival;
        if (currentSurvival >= longestSurvival) {
          window.localStorage.setItem("longest_survival", currentSurvival);
        }
        this.isGameOver = true;
        this._preStopScene(this.scene.get("UIScene"));
        this.scene.stop("UIScene");
        this._preStopScene(this); // MainScene
        this.scene.start("GameOverScene", {
          longestSurvivalInSeconds: longestSurvival,
          currentSurvivalInSeconds: currentSurvival,
        });
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
      this.cameras.main.zoomTo(
        futureZoom,
        300,
        "Power2",
        false,
        (camera, progress) => {
          let offsetXCorrected = offset.x / camera.zoom;
          let offsetYCorrected = offset.y / camera.zoom;
          camera.centerOn(
            position.x - offsetXCorrected,
            position.y - offsetYCorrected
          );
        }
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

  _preStopScene(scene) {
    scene.registry.destroy();
    this._removeAllListeners(scene);
    scene.time.removeAllEvents();
  }

  _removeAllListeners(scene) {
    let events = [
      "alert-message",
      "building-destroyed",
      "building-in-progress-right-clicked",
      "enemy-died",
      "enemy-right-clicked",
      "map-left-or-middle-clicked",
      "map-right-clicked",
      "mouse-moving-over-map",
      "new-building-selected",
      "new-enemy-selected",
      "new-villager-created",
      "new-villager-selected",
      "resource-deposit-increased",
      "resource-destroyed",
      "resource-right-clicked",
      "villager-died",
      "villager-unselected",
    ];
    events.forEach((e) => scene.events.off(e));
  }

  _getNowTime() {
    return new Date().getTime();
  }
}
