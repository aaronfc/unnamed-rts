import Movement from "../../../behaviours/movement.js";
import Fighting from "../../../behaviours/fighting.js";

export default class AtttackEntityCommand {
  constructor(entity, attackedEntity) {
    this.entity = entity;
    this.attackedEntity = attackedEntity;
    this.done = false; // Changing to true when reaching the destination
    // Behaviours
    this.movement = new Movement(this.entity.scene); // TODO Fix this reference to entity's scene
    this.fighting = new Fighting(this.movement);
  }

  update() {
    if (this.attackedEntity.health > 0) {
      this.fighting.moveIntoAttackRangeAndAttack(
        this.entity,
        this.attackedEntity,
        this.entity.attackDamage,
        this.entity.attackPeriodInSeconds
      );
    } else {
      let closestEnemy = this.entity.scene.map.getClosestEntity(
        this.entity,
        this.entity.team === "ai"
          ? this.entity.scene.villagers
          : this.entity.scene.enemies
      );
      if (closestEnemy != null) {
        this.attackedEntity = closestEnemy;
      } else {
        return true; // Done here
      }
    }
    return false; // Continue running
  }
}
