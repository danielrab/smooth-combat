class DamageRollPartHandler {
  constructor(roll, type) {
    this.roll = roll;
    this.type = type;
  }

  get total() {
    return this.roll.total;
  }

  get formula() {
    return this.roll._formula;
  }

  getDamage(target) {
    return Math.floor(target.actor.damageMultiplier(this.type) * this.total);
  }
}

export default async function DamageRollPart(item, [formula, type], critical) {
  const roll = await game.dnd5e.dice.damageRoll({
    parts: [formula],
    data: item.getRollData(),
    critical,
    fastForward: true,
    chatMessage: false,
  });
  return new DamageRollPartHandler(roll, type);
}
