export default class Building {
  constructor(scene) {
    this.scene = scene;
    this.events = scene.events;
  }

  build(entity, units) {
    if (entity.buildingAmount >= entity.buildingCost) {
      return true; // Already built
    }
    // Increase buildingProgress
    entity.buildingAmount += units;
    let progress = entity.buildingAmount / entity.buildingCost;
    entity.setAlpha(0.5 + progress * 0.5);
    if (progress >= 1) {
      entity.status = "built";
      entity.clearTint();
    }
    return entity.status == "built"; // return true when the building is done
  }

  place(entity) {
    // Check if construction is possible
    if (entity._canBeBuilt()) {
      entity.status = "building";
      entity.setTint(0xcccccc);
      return true;
    } else {
      // TODO Send message saying "you cant build here"
      return false;
    }
  }

  destroy(entity) {
    this.events.emit("building-destroyed", entity);
  }

  move(entity, position) {
    entity.setPosition(position);
    if (entity._canBeBuilt(position)) {
      entity.setTint(0xaaffaa);
    } else {
      entity.setTint(0xffaaaa);
    }
    if (entity.attackRangeCircle != null) {
      entity.attackRangeCircle.setPosition(
        entity.x + entity.width / 2,
        entity.y + entity.height / 2
      );
    }
  }
}
