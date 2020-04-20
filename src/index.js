import Phaser from "phaser";
import logoImg from "./assets/logo.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
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

  // Create main building
  var mainBuilding = this.add.rectangle(0, 0, 100, 50, "0x0000FF");
  mainBuilding.setOrigin(0,0);
  
  // Create Adan
  var villagerPosition = [
    mainBuilding.x + mainBuilding.width + 10,
    mainBuilding.y + mainBuilding.height + 10
  ];
  this.villager = this.add.circle(villagerPosition[0], villagerPosition[1], 5, "0x0000FF");
  this.villager.setInteractive();
  this.villager.destination = villagerPosition;
  this.villager.selected = false;
  this.ignoreFirstClick = false;
  this.villager.on('pointerdown', () => {
    this.villager.setStrokeStyle(1, "0xFF0000");
    this.villager.selected = true;
    this.ignoreFirstClick = true;
  });

  // Input
  this.input.mouse.disableContextMenu();
  this.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown())
        {
            if (this.villager.selected)
            {
                this.villager.destination = [pointer.x, pointer.y];
                this.villager.selected = false;
                this.villager.setStrokeStyle(0);
            }
        }
        if (pointer.leftButtonDown())
        {
            if (this.villager.selected && !this.ignoreFirstClick)
            {
                this.villager.selected = false;
                this.villager.setStrokeStyle(0);
            }
            this.ignoreFirstClick = false;
        }
    });
}

function update() {
  //this.villager.x += Math.random();
  //this.villager.x -= Math.random();
  //this.villager.y += Math.random();
  //this.villager.y -= Math.random();
  var villagerDistanceToDestinationX = Math.abs(this.villager.destination[0] - this.villager.x);
  var villagerDistanceToDestinationY = Math.abs(this.villager.destination[1] - this.villager.y);
  if (villagerDistanceToDestinationX > 1) {
    this.villager.x += this.villager.destination[0] > this.villager.x ? 1 : -1;
  }
  if (villagerDistanceToDestinationY > 1) {
    this.villager.y += this.villager.destination[1] > this.villager.y ? 1 : -1;
  }
}
