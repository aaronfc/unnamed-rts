import TiledGameObject from "../../tiled-game-object.js";
import Building from "../../behaviours/building.js";
import Projectile from "../objects/projectile.js";

export default class Tower extends TiledGameObject {
  constructor(scene, x, y) {
    let config = {
      spritesheet: "tower-spritesheet",
      layers: [
        {
          data: [
            [
              { id: 0, collide: false, depth: 10 },
              { id: 1, collide: false, depth: 10 },
            ],
            [
              { id: 2, collide: false, depth: 10 },
              { id: 3, collide: false, depth: 10 },
            ],
            [
              { id: 4, collide: false, depth: 10 },
              { id: 5, collide: false, depth: 10 },
            ],
            [
              { id: 6, collide: true, depth: 0 },
              { id: 7, collide: true, depth: 0 },
            ],
          ],
        },
      ],
    };
    super(scene, x, y, config);

    // Properties
    this.events = scene.events;
    this.status = "placing"; // placing | building | built
    this.characteristics = [];
    this.buildingCost = 50;
    this.buildingAmount = 0;
    this.setAlpha(0.5);
    this.building = new Building(scene);
    this.selected = false;
    // Attack-related attributes
    this.hitDamage = 10;
    this.coolDown = 1; // Time needed to be able to shoot again
    this.attackRange = 200;
    this.latestShootTime = null;
    this.target = null;
    this.attackRangeCircle = this.scene.add.circle(
      this.x + this.width / 2,
      this.y + this.height / 3,
      this.attackRange,
      "0x0000FF",
      0.1
    );
    this.attackRangeCircle.visible = false;

    // Events
    this.setInteractive();
    this.on("pointerdown", (pointer, localX, localY, event) => {
      if (this.status == "building" && pointer.rightButtonDown()) {
        this.events.emit("building-in-progress-right-clicked", this);
      }
      if (this.status != "placing" && pointer.leftButtonDown()) {
        if (this.selected) {
          this.unselect();
        } else {
          this.events.emit("new-building-selected");
          this.select();
        }
        // Stop event propagation
        event.stopPropagation();
      }
    });
  }

  build(units) {
    return this.building.build(this, units);
  }

  place() {
    return this.building.place(this);
  }

  destroy() {
    this.building.destroy(this);
    super.destroy(this);
  }

  move(position) {
    this.building.move(this, position);
  }

  select() {
    console.log("selected");
    this.setStrokeStyle(1, "0xFF0000");
    this.selected = true;
    this.attackRangeCircle.visible = true;
    // Listen for any map event
    this.events.once("map-left-or-middle-clicked", this.unselect, this);
    this.events.once("new-villager-selected", this.unselect, this);
  }

  unselect() {
    this.setStrokeStyle(0);
    this.selected = false;
    this.attackRangeCircle.visible = false;
    // Stop listening events
    this.events.off("map-left-or-middle-clicked", this.unselect, this);
    this.events.off("new-villager-selected", this.unselect, this);
  }

  update() {
    // Respect the cooldown
    let now = Math.floor(new Date() / 1000);
    if (
      this.latestShootTime != null &&
      this.latestShootTime > now - this.coolDown
    ) {
      return;
    }
    if (this.target != null) {
      // Remove lock if target is out of range (or dead)
      if (this.target.health <= 0) {
        this.target = null;
        //console.log("Removing lock because dead");
      } else {
        let distance = Phaser.Math.Distance.BetweenPoints(
          new Phaser.Math.Vector2(
            this.x + this.width / 2,
            this.y + this.height / 3
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
        let distance = Phaser.Math.Distance.BetweenPoints(
          new Phaser.Math.Vector2(
            this.x + this.width / 2,
            this.y + this.height / 3
          ),
          closestEnemy
        );
        if (distance <= this.attackRange) {
          //console.log("Enemy locked!");
          this.target = closestEnemy;
        }
      }
    }
    if (this.target != null) {
      //console.log("Enemy hit!");
      // Probably we should predict the new position of the enemy for optimal direction
      this._shootProjectile(this.target.getCenter());
      this.latestShootTime = now;
    }
  }

  // TODO Probably all this "canBeBuilt" check, must be moved to the building behaviour.
  _canBeBuilt() {
    let hasEnoughResource = this.scene.counters.resource >= this.buildingCost;
    // TODO Maybe moving this "isFree" logic to the map object?
    let intersectingBuildings = this.scene.map.buildings.filter(
      (b) =>
        !Phaser.Geom.Rectangle.Intersection(
          b.getBounds(),
          this.getBounds()
        ).isEmpty()
    );
    let intersectingResources = this.scene.map.resources.filter(
      (r) =>
        !Phaser.Geom.Rectangle.Intersection(
          r.getBounds(),
          this.getBounds()
        ).isEmpty()
    );
    let positionIsFree =
      intersectingBuildings.length == 0 && intersectingResources.length == 0;
    return hasEnoughResource && positionIsFree;
  }

  _shootProjectile(destination) {
    this.scene.projectiles.push(
      new Projectile(
        this.scene,
        new Phaser.Math.Vector2(
          this.x + this.width / 2,
          this.y + this.height / 3
        ),
        1,
        destination,
        this.attackRange,
        this.hitDamage
      )
    );
  }
}
