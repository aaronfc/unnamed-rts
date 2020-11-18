import Phaser from "phaser";
import Villager from "./villager.js";
import TiledGameObject from "../tiled-game-object.js";
import Storing from "../behaviours/storing.js";
import Flag from "./flag.js";
import Projectile from "./projectile.js";

export default class TownCenter extends TiledGameObject {
  constructor(scene, x, y) {
    let config = {
      layers: [
        {
          // Ground
          data: [
            [
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
            [
              { id: 520, collide: true, depth: 0 },
              { id: 521, collide: true, depth: 0 },
              { id: 521, collide: true, depth: 0 },
              { id: 521, collide: true, depth: 0 },
              { id: 521, collide: true, depth: 0 },
              { id: 521, collide: true, depth: 0 },
              { id: 522, collide: true, depth: 0 },
            ],
            [
              { id: 577, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 579, collide: true, depth: 0 },
            ],
            [
              { id: 577, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 579, collide: true, depth: 0 },
            ],
            [
              { id: 577, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 578, collide: true, depth: 0 },
              { id: 579, collide: true, depth: 0 },
            ],
            [
              { id: 634, collide: true, depth: 0 },
              { id: 635, collide: true, depth: 0 },
              { id: 635, collide: true, depth: 0 },
              { id: 635, collide: true, depth: 0 },
              { id: 635, collide: true, depth: 0 },
              { id: 635, collide: true, depth: 0 },
              { id: 636, collide: true, depth: 0 },
            ],
          ],
        },
        {
          // Over-ground
          data: [
            [
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: 616, collide: false, depth: 0 },
              { id: 617, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
            [
              { id: 616, collide: false, depth: 0 },
              { id: 617, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: 673, collide: false, depth: 0 },
              { id: 674, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
            [
              { id: 673, collide: false, depth: 0 },
              { id: 674, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
            [
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: 470, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: 616, collide: false, depth: 0 },
              { id: 617, collide: false, depth: 0 },
            ],
            [
              { id: 616, collide: false, depth: 0 },
              { id: 617, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: 425, collide: false, depth: 0 },
              { id: 673, collide: false, depth: 0 },
              { id: 674, collide: false, depth: 0 },
            ],
            [
              { id: 673, collide: false, depth: 0 },
              { id: 674, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
              { id: null, collide: false, depth: 0 },
            ],
          ],
        },
      ],
    };
    super(scene, x, y, config);

    // Properties
    this.scene = scene;
    this.status = "placing"; // placing | building | built
    this.events = scene.events;
    this.selected = false;
    this.menu = new TownCenterMenu(scene, this);
    this.enqueuedOrders = [];
    this.runningOrder = null;
    this.ORDERS = {
      "create-villager": {
        action: this.createVillager.bind(this),
        cost: { resource: 20 },
        populationSlots: 1,
        time: 10,
      },
    };
    this.characteristics = ["STORAGE"];
    this.storing = new Storing(scene);
    // Attack-related attributes
    this.target = null;
    this.attackRange = 300;
    this.latestShootTime = null;
    this.coolDown = 1;
    this.hitDamage = 10;
    this.attackRangeCircle = this.scene.add.circle(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.attackRange,
      "0x0000FF",
      0.1
    );
    this.attackRangeCircle.visible = false;

    // Set new villager initial position
    let bounds = this.getBounds();
    this.newEntityInitialPosition = new Phaser.Math.Vector2(
      bounds.centerX + bounds.width / 2 + 10,
      bounds.centerY + bounds.height / 2 + 10
    );
    this.newEntityInitialPositionFlag = new Flag(
      this.scene,
      this.newEntityInitialPosition
    );
    this.newEntityInitialPositionFlag.setVisible(false); // By default it's not shown

    // Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        if (this.selected) {
          this.unselect();
        } else {
          this.events.emit("new-building-selected");
          this.select();
        }
        // Display action menu
        event.stopPropagation();
      }
    });
  }

  update() {
    // If there is a running order, check if it's done and then execute the action
    if (this.runningOrder != null) {
      let runningOrder = this.getRunningOrder();
      if (runningOrder.percentage >= 1) {
        runningOrder.action();
        this.runningOrder = null;
      }
    }

    // If not running any order and there are orders pending: start the next one
    if (this.runningOrder == null && this.getEnqueuedOrdersAmount() > 0) {
      let nextOrder = this.enqueuedOrders[0];
      let nextOrderData = this.ORDERS[nextOrder];
      let villagersFreeSlots =
        this.scene.counters.maximumPopulation - this.scene.counters.villagers;
      if (nextOrderData.populationSlots <= villagersFreeSlots) {
        let order = this.enqueuedOrders.shift();
        this.runningOrder = { order: order, startTime: new Date().getTime() };
      }
    }

    // Update menu if visible
    if (this.menu.visible) {
      this.menu.update();
    }

    // Attacking from here
    // Respect the cooldown
    let now = Math.floor(new Date() / 1000);
    if (
      this.latestShootTime == null ||
      this.latestShootTime < now - this.coolDown
    ) {
      if (this.target != null) {
        // Remove lock if target is out of range (or dead)
        if (this.target.health <= 0) {
          this.target = null;
          //console.log("Removing lock because dead");
        } else {
          let distance = Phaser.Math.Distance.BetweenPoints(
            new Phaser.Math.Vector2(
              this.x + this.width / 2,
              this.y + this.height / 2
            ),
            this.target
          );
          //console.log("Closest enemy distance: ", distance);
          if (distance > this.attackRange) {
            this.target = null;
            //console.log("Removing lock because out of range");
          }
        }
      }
      if (this.target == null) {
        // Calculate closest enemy and lock it if in range
        let closestEnemy = this.scene.map.getClosestEntity(
          this,
          this.scene.enemies
        ); // TODO ⚠️  Non-optimal approach. We are calculating the closest enemy for every tick of the game!
        //console.log("Closest enemy:", closestEnemy);
        if (closestEnemy != null) {
          let shootingOrigin = new Phaser.Math.Vector2(
            this.x + this.width / 2,
            this.y + this.height / 2
          );
          let distance = Phaser.Math.Distance.BetweenPoints(
            shootingOrigin,
            closestEnemy
          );
          if (distance <= this.attackRange) {
            //console.log("Enemy locked!");
            this.target = closestEnemy;
          }
        }
      }
      if (this.target != null) {
        //console.log("Enemy shot!");
        // Probably we should predict the new position of the enemy for optimal direction
        this._shootProjectile(this.target.getCenter());
        this.latestShootTime = now;
      }
    }
  }

  select() {
    this.setStrokeStyle(1, "0xFF0000");
    this.selected = true;
    this.menu.visible = true;
    this.newEntityInitialPositionFlag.setVisible(true);
    this.attackRangeCircle.visible = true;
    // Listen for any map click to unselect
    this.events.on("map-right-clicked", this.updateInitialPosition, this);
    this.events.once("map-left-or-middle-clicked", this.unselect, this);
    this.events.once("new-villager-selected", this.unselect, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    this.menu.visible = false;
    this.newEntityInitialPositionFlag.setVisible(false);
    this.attackRangeCircle.visible = false;
    // Stop listening events
    this.events.off("map-right-clicked", this.updateInitialPosition, this);
    this.events.off("map-left-or-middle-clicked", this.unselect, this);
    this.events.off("new-villager-selected", this.unselect, this);
  }

  updateInitialPosition(pointer) {
    this.newEntityInitialPositionFlag.setPosition({
      x: pointer.worldX,
      y: pointer.worldY,
    });
  }

  getNewVillagerPosition() {
    return new Phaser.Math.Vector2(
      this.newEntityInitialPositionFlag.x,
      this.newEntityInitialPositionFlag.y
    );
  }

  createVillager() {
    // Create new villager in initial position
    let newVillager = new Villager(
      this.scene,
      this.newEntityInitialPosition.x,
      this.newEntityInitialPosition.y,
      this
    );
    // Make new villager move to proper destination
    var newEntityDestination = this.getNewVillagerPosition();
    newVillager.moveToPosition(newEntityDestination);
    this.events.emit("new-villager-created", newVillager);
  }

  addCreateVillagerOrder() {
    let order = this.ORDERS["create-villager"];
    if (this.scene.counters.resource >= order.cost.resource) {
      this.scene.counters.resource -= order.cost.resource;
      this.enqueuedOrders.push("create-villager");
    } else {
      // TODO Isolate this scene from using UIScene directly - probably events-based
      this.scene.scene
        .get("UIScene")
        .events.emit("alert-message", "Not enough resource!", this);
    }
  }

  deposit(amount) {
    this.storing.deposit(amount);
  }

  getRunningOrder() {
    if (this.runningOrder != null) {
      let orderInfo = this.ORDERS[this.runningOrder.order];
      let percentage =
        (new Date().getTime() - this.runningOrder.startTime) /
        (orderInfo.time * 1000);
      return { ...orderInfo, percentage };
    }
    return null;
  }

  getEnqueuedOrdersAmount() {
    return this.enqueuedOrders.length;
  }

  _shootProjectile(destination) {
    this.scene.projectiles.push(
      new Projectile(
        this.scene,
        new Phaser.Math.Vector2(
          this.x + this.width / 2,
          this.y + this.height / 2
        ),
        1,
        destination,
        this.attackRange,
        this.hitDamage
      )
    );
  }
}

class TownCenterMenu extends Phaser.GameObjects.Container {
  constructor(scene, townCenter) {
    let bounds = townCenter.getBounds();
    let x = bounds.left;
    let y = bounds.bottom;
    let width = bounds.width;
    // Rectangle
    super(scene, x, y, []);
    scene.add.existing(this);
    this.setDepth(500);
    this.visible = false;

    // Properties
    this.scene = scene;
    this.townCenter = townCenter;

    // Create all GUI elements

    // Background (rectangle)
    this.backgroundRectangle = scene.add
      .rectangle(0, 0, width, 34, "0xa0beff")
      .setOrigin(0)
      .setAlpha(0.5);
    this.add(this.backgroundRectangle);

    // Villagers info
    this.villagersIcon = scene.add
      .image(5, 5, "villager-icon")
      .setOrigin(0)
      .setScale(0.5)
      .setInteractive({ cursor: "pointer" });
    // Adding action to the villagersIcon
    this.villagersIcon.on("pointerdown", (pointer, localX, localY, event) => {
      if (pointer.leftButtonDown()) {
        this.townCenter.addCreateVillagerOrder();
        event.stopPropagation();
      }
    });
    this.add(this.villagersIcon);
    this.villagersText = scene.add.text(
      this.villagersIcon.x + this.villagersIcon.displayWidth + 5,
      10,
      "",
      { color: "#000000", fontSize: 10 }
    );
    this.add(this.villagersText);
    this.villagersEnqueuedText = scene.add.text(
      this.villagersIcon.x,
      this.villagersIcon.y + this.villagersIcon.displayHeight,
      "",
      { color: "#000000", fontSize: 10 }
    );
    this.add(this.villagersEnqueuedText);
  }

  update() {
    let runningOrder = this.townCenter.getRunningOrder();
    if (runningOrder != null) {
      this.villagersText.setText(
        Math.floor(runningOrder.percentage * 100) + "%"
      );
    } else {
      this.villagersText.setText("");
    }

    let enqueuedOrdersAmount = this.townCenter.getEnqueuedOrdersAmount();
    this.villagersEnqueuedText.setText(
      enqueuedOrdersAmount == 0 ? "" : "Q:" + enqueuedOrdersAmount
    );
  }
}
