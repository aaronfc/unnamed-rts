export default class Movement {
  constructor() {}

  // Private functions

  _moveCloserTo(element, x, y) {
    let vector = new Phaser.Math.Vector2(
      x - element.x,
      y - element.y
    ).normalize();
    element.setVelocity(vector.x, vector.y);
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

  moveTo(element, target, reachedCallback, margin = null) {
    let marginX = margin ? margin.x : element.width / 2 + 2;
    let marginY = margin ? margin.y : element.height / 2 + 2;
    if (typeof target.getBounds === "function") {
      // Checking if target is a point or has an actual body
      let bounds = target.getBounds();
      marginX += bounds.width / 2;
      marginY += bounds.height / 2;
    }
    if (this._isAsClosestAsPossibleTo(element, target, marginX, marginY)) {
      // Set high friction and stop velocity
      element.setFrictionAir(0.5);
      element.setVelocity(0);
      // Run the actual callback
      reachedCallback();
    } else {
      // Set low friction
      element.setFrictionAir(0.01);
      this._moveCloserTo(element, target.x, target.y);
    }
  }
}
