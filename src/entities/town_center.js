import Phaser from "phaser";
import Villager from "./villager.js";

export default class TownCenter extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    // Create resource mine
    super(scene, x, y, 100, 50, "0x0000FF");
    scene.add.existing(this);
    scene.matter.add.gameObject(this);
    this.setStatic(true);

    // Properties
    this.scene = scene;
    this.events = scene.events;
    this.selected = false;
    this.menu = new TownCenterMenu(scene, x - 50, y + 25, this);
    this.enqueuedOrders = [];
    this.runningOrder = null;
    this.ORDERS = {
      "create-villager": {
        action: this.createVillager.bind(this),
        cost: { resource: 20 },
        time: 10,
      },
    };

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
      let order = this.enqueuedOrders.shift();
      this.runningOrder = { order: order, startTime: new Date().getTime() };
    }

    // Update menu if visible
    if (this.menu.visible) {
      this.menu.update();
    }
  }

  select() {
    this.setStrokeStyle(1, "0xFF0000");
    this.selected = true;
    this.menu.visible = true;
    // Listen for any map click to unselect
    this.events.once("map-left-or-middle-clicked", this.unselect, this);
    this.events.once("new-villager-selected", this.unselect, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    this.menu.visible = false;
  }

  getNewVillagerPosition() {
    return new Phaser.Math.Vector2(
      this.x + this.width / 2 + 10,
      this.y + this.height / 2 + 10
    );
  }

  createVillager() {
    var newPosition = this.getNewVillagerPosition();
    let newVillager = new Villager(
      this.scene,
      newPosition.x,
      newPosition.y,
      this
    );
    this.events.emit("new-villager-created", newVillager);
  }

  addCreateVillagerOrder() {
    let order = this.ORDERS["create-villager"];
    if (this.scene.counters.resource >= order.cost.resource) {
      this.scene.counters.resource -= order.cost.resource;
      this.enqueuedOrders.push("create-villager");
    } else {
      // TODO Isolate this scene from using UIScene directly - probably events-based
      this.scene.scene.get('UIScene').events.emit('alert-message', 'Not enough resource!', this);
    }
  }

  deposit(amount) {
    this.events.emit("resource-deposit-increased", amount, this);
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
}

class TownCenterMenu extends Phaser.GameObjects.Container {
  constructor(scene, x, y, townCenter) {
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
      .rectangle(0, 0, 100, 34, "0xa0beff")
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
    (this.villagersText = scene.add.text(
      this.villagersIcon.x + this.villagersIcon.displayWidth + 5,
      10,
      "",
      { color: "#000000", fontSize: 10 }
    )),
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
