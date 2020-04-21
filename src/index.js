import Phaser from "phaser";
import Villager from "./villager.js";

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
  var villagerPosition = new Phaser.Math.Vector2(
    mainBuilding.x + mainBuilding.width + 10,
    mainBuilding.y + mainBuilding.height + 10
  );
  this.villager = new Villager(this, villagerPosition.x, villagerPosition.y);
  // Input
  this.input.mouse.disableContextMenu();
  this.input.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown())
        {
            if (this.villager.selected)
            {
                this.villager.destination = new Phaser.Math.Vector2(pointer.x, pointer.y);
                this.villager.selected = false;
            }
        }
        if (pointer.leftButtonDown())
        {
            if (this.villager.selected)
            {
                this.villager.selected = false;
            }
        }
    });
}

function update() {
  this.villager.update();
}
