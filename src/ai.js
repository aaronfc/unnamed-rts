export default class AI {
  constructor(scene) {
    this.scene = scene;
  }

  update(time, delta) {
    this.scene.enemies.forEach((unit) => {
      let closestVictim = this.scene.map.getClosestEntity(
        unit,
        this.scene.villagers
      ); // TODO ⚠️  Non-optimal approach. We are calculating the closest enemy for every tick of the game!
      if (closestVictim !== null) {
        unit.attack(closestVictim);
      }
    });
  }
}
