class AttackRollHandler {
  constructor(roll, target) {
    this.roll = roll;
    this.target = target;
  }

  get hits() {
    return this.total >= this.target.actor.ac && !this.fumble;
  }

  get die() {
    return this.roll.terms[0];
  }

  get total() {
    return this.roll.total;
  }

  get formula() {
    return this.roll._formula;
  }

  get critical() {
    return this.die.results[0].result >= this.die.options.critical;
  }

  get fumble() {
    return this.die.results[0].result <= this.die.options.fumble;
  }
}

export default async function attackRoll(item, target, options) {
  const roll = await item.rollAttack({
    ...options,
    fastForward: true,
    chatMessage: false,
  });
  return new AttackRollHandler(roll, target);
}
