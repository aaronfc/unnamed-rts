export default class Fighting {

  constructor(movement) {
    // Dependency injection
    this.movement = movement;
    // Properties
    this.latestAttackTime = 0;
  }

  // Public functions

  /**
   * Try to move into attack range and when close enough attack dealing {damage} every {periodInSeconds} seconds.
   */
  moveIntoAttackRangeAndAttack(element, target, damage, periodInSeconds) {
    this.movement.moveTo(element, target, () => {
      let now = Math.floor(new Date()/1000);
      if (now - this.latestAttackTime >= periodInSeconds) {
        target.hit(element, damage);
        this.latestAttackTime = now;
      }
    });
  }

  /**
   * Given a specific entity and a list of other entities returns the closest one to the first.
   */
  getClosestEntity(element, entities) {
    if (entities.length > 0) {
      let closestEntity = entities[0];
      let closestEntityDistance = Phaser.Math.Distance.BetweenPoints(element, closestEntity);
      for (var i=1; i < entities.length; i++) {
        let entity = entities[i];
        let distance = Phaser.Math.Distance.BetweenPoints(element, entity);
        if (distance < closestEntityDistance) {
          closestEntity = entity;
          closestEntityDistance = distance;
        }
      }
      return closestEntity;
    }
    return null;
  }
}
