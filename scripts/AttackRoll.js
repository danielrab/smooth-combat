class AttackRollHandler {
  constructor(roll) {
    this.roll = roll;
  }

  hits(target) {
    return this.roll.total >= target.actor.data.data.attributes.ac.value;
  }

  async render() {
    return this.roll.render();
  }

  get die() {
    return this.roll.terms[0];
  }

  get total() {
    return this.roll.total;
  }

  get critical() {
    return this.die.results[0].result >= this.die.options.critical;
  }

  get fumble() {
    return this.die.results[0].result <= this.die.options.fumble;
  }
}

export default async function attackRoll(item, { advantage = false, disadvantage = false }) {
  const roll = await item.rollAttack({
    fastForward: true,
    advantage,
    disadvantage,
    chatMessage: false,
  });
  return new AttackRollHandler(roll);
}
