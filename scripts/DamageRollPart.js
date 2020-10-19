import TokenHandler from './TokenHandler.js';

class DamageRollPartHandler {
  constructor(roll, type) {
    this.roll = roll;
    this.type = type;
  }

  async render() {
    return `${await this.roll.render()} ${this.type} damage`;
  }

  get total() {
    return this.roll.total;
  }

  getDamage(target) {
    return Math.floor(new TokenHandler(target).damageMultiplier(this.type) * this.total);
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
