class AttackRollHandler {
  constructor(roll) {
    this.roll = roll;
  }

  hits(target) {
    return this.total >= target.actor.ac && !this.fumble;
  }

  async render() {
    const roll = await renderTemplate('./modules/smooth-combat/templates/attackRoll.html', this.roll);
    return roll;
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
