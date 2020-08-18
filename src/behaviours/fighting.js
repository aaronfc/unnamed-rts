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
      let now = Math.floor(new Date() / 1000);
      if (now - this.latestAttackTime >= periodInSeconds) {
        target.hit(element, damage);
        this.latestAttackTime = now;
      }
    });
  }
}
