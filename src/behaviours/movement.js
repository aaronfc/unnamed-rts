const SWING_AMOUNT = 0.4;
export default class Movement {
  constructor(scene) {
    this.scene = scene;
    this.target = null;
    this.targetInitialPosition = null;
    this.to = null;
    this.route = null;
    this.swing = SWING_AMOUNT / 2;
  }

  // Private functions

  _moveCloserTo(element, x, y, shouldSwing) {
    let vector = new Phaser.Math.Vector2(
      x - element.x,
      y - element.y
    ).normalize();
    element.setVelocity(vector.x, vector.y);
    if (shouldSwing) {
      this.swing = (this.swing + 0.05) % SWING_AMOUNT;
      element.setRotation(this.swing - SWING_AMOUNT / 2);
    }
  }

  _isAsClosestAsPossibleTo(element, destination, marginX, marginY) {
    var villagerDistanceToDestinationX = Math.abs(destination.x - element.x);
    var villagerDistanceToDestinationY = Math.abs(destination.y - element.y);
    return (
      villagerDistanceToDestinationX <= marginX &&
      villagerDistanceToDestinationY <= marginY
    );
  }

  // Public functions

  moveTo(element, target, reachedCallback, margin = null, shouldSwing = true) {
    // TODO Check if margin can be removed
    if (
      this.targetInitialPosition == null ||
      this.targetInitialPosition.x != target.x ||
      this.targetInitialPosition.y != target.y
    ) {
      this.targetInitialPosition = { x: target.x, y: target.y };
      let targetPosition = this.targetInitialPosition;
      // Calculate the closest point for the target
      if (typeof target.getTopLeft === "function") {
        targetPosition = {
          x: target.getTopLeft().x,
          y: target.getTopLeft().y,
        };
        let distance = Phaser.Math.Distance.BetweenPoints(
          element,
          targetPosition
        );
        for (var i = 0; i < 1; i += 0.25) {
          let newPosition = Phaser.Geom.Rectangle.GetPoint(
            target.getBounds(),
            i
          );
          let newDistance = Phaser.Math.Distance.BetweenPoints(
            element,
            newPosition
          );
          if (newDistance < distance) {
            targetPosition = newPosition;
            distance = newDistance;
          }
        }
      }
      if (
        this.to == null ||
        this.to.x != targetPosition.x ||
        this.to.y != targetPosition.y
      ) {
        this.to = targetPosition;
        this.route = this.scene.navigation.findPath(element, targetPosition);
        if (this.route != null) {
          this.route.shift(); // Drop first element because it's the starting point
        }
      }
      this.target = target;
    }

    if (!this.route) {
      return; // No route to destination
    }
    if (this.route.length == 0) {
      // Already there
      // Set high friction and stop velocity
      element.setFrictionAir(0.5);
      element.setVelocity(0);
      element.setRotation(0);
      // Run the actual callback
      reachedCallback();
      return;
    }
    let anchor = this.route[0];

    let marginX = margin ? margin.x : element.width / 2 + 2;
    let marginY = margin ? margin.y : element.height / 2 + 2;
    if (this._isAsClosestAsPossibleTo(element, anchor, marginX, marginY)) {
      this.route.shift(); // Drop first element, as we already got as closest as possible to it.
      if (anchor.x == this.to.x && anchor.y == this.to.y) {
        // Set high friction and stop velocity
        element.setFrictionAir(0.5);
        element.setVelocity(0);
        element.setRotation(0);
        // Run the actual callback
        reachedCallback();
      }
    } else {
      // Set low friction
      element.setFrictionAir(0.01);
      this._moveCloserTo(element, anchor.x, anchor.y, shouldSwing);
    }
  }
}
