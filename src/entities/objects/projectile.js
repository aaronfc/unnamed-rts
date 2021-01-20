import Phaser from "phaser";
import Movement from "../../behaviours/movement.js";
import Fighting from "../../behaviours/fighting.js";

export default class Projectile extends Phaser.GameObjects.Sprite {
  constructor(scene, initialPosition, speed, finalPosition, range, damage) {
    super(scene, initialPosition.x, initialPosition.y, "arrow");
    scene.add.existing(this);
    scene.matter.add.gameObject(this);

    // Properties
    this.scene = scene;
    this.events = scene.events;
    this.speed = speed;
    this.initialPosition = initialPosition;
    this.finalPosition = finalPosition;
    this.directionVector = finalPosition
      .clone()
      .subtract(initialPosition)
      .normalize();
    this.setOrigin(0.5, 0);
    this.setCollisionCategory(null);
    this.setFriction(0);
    this.setFrictionAir(0);
    this.setVelocity(
      this.directionVector.x * speed,
      this.directionVector.y * speed
    );
    this.range = range;
    this.damage = damage;
    this.depth = 99;
    this.rotation =
      Phaser.Math.Angle.BetweenPoints(this.getCenter(), this.finalPosition) +
      Math.PI / 2;

    // Behaviours
    this.movement = new Movement(this.scene);
    this.fighting = new Fighting(this.movement);
  }

  update() {
    let distanceFromInitialPosition = this.initialPosition.distance(
      new Phaser.Math.Vector2(this.x, this.y)
    );
    let isOutOfRange = distanceFromInitialPosition > this.range;
    if (isOutOfRange) {
      this.destroy();
    } else {
      // TODO ⚠️  This **must** be optimized
      let hitEnemy = this.scene.enemies.find((e) =>
        Phaser.Geom.Rectangle.Overlaps(e.getBounds(), this.getBounds())
      );
      if (hitEnemy) {
        hitEnemy.hit(this, this.damage);
        this.destroy();
      }
    }
  }

  destroy() {
    this.events.emit("projectile-died", this);
    super.destroy(this);
  }
}
