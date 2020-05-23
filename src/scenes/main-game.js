import Phaser from "phaser";
import Villager from "../villager.js";
import Resource from "../resource.js";
import TownCenter from "../town_center.js";
import Enemy from "../enemy.js";

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super("MainGameScene");
  }

  preload() {
    this.load.image("villager-icon", "assets/villager-icon.png");
  }

  create() {
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

    // World boders
    this.matter.world.setBounds(
      0,
      0,
      4 * 1024,
      4 * 1024,
      64,
      true,
      true,
      true,
      true
    );
    this.add.rectangle(0, 0, 1024 * 4, 1024 * 4, "0xFAFAFA").setOrigin(0, 0);

    // Camera control
    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.06,
      drag: 0.0005,
      maxSpeed: 1.0,
    };
    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(
      controlConfig
    );
    this.cameras.main.setBackgroundColor("rgba(0, 0, 0, 1)");
    this.cameras.main.setBounds(-100, -100, 1024 * 4 + 200, 1024 * 4 + 200);

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
    let newBadGuyPosition = { x: 500, y: 500 };
    //this.enemies.push(new Enemy(this, newBadGuyPosition.x, newBadGuyPosition.y));
    //this.enemies.push(new Enemy(this, newBadGuyPosition.x, newBadGuyPosition.y));

    // Resource
    var resource = new Resource(this, 200, 200, 1000);
    this.resources.push(resource);

    // Enemies creation
    this.enemiesNextWave = 1;
    this.scheduleNextWave = () => {
      this.time.addEvent({
        delay: 60 * 1000, // Enemies appear every 1 minute
        callback: () => {
          for (var i = 0; i < this.enemiesNextWave; i++) {
            // create random enemy
            let randomPosition = {
              x: _randomInt(0, 500),
              y: _randomInt(0, 500),
            };
            this.enemies.push(
              new Enemy(this, randomPosition.x, randomPosition.y)
            );
          }
          this.enemiesNextWave += 1;
          this.scheduleNextWave();
        },
        callbackScope: this,
      });
    };
    this.scheduleNextWave();

    // Input
    this.input.mouse.disableContextMenu();
    this.input.on("pointerdown", (pointer) => {
      if (pointer.rightButtonDown()) {
        this.events.emit("map-right-clicked", pointer);
      } else {
        this.events.emit("map-left-or-middle-clicked", pointer);
      }
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
  }

  update(time, delta) {
    if (!this.isGameOver) {
      this.counters.gameTime += delta / 1000; // TODO Implement this in a proper way
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

    // Limit zoom
    this.cameras.main.setZoom(
      Phaser.Math.Clamp(this.cameras.main.zoom, 0.5, 1.5)
    );
  }

  _randomInt(min, max) {
    return Math.random() * (max - min) + min;
  }
}
