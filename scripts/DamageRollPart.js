class DamageRollPartHandler {
  constructor(roll, type) {
    this.roll = roll;
    this.type = type;
  }

  async render() {
    const rollElement = $(await this.roll.render());
    const diceTotal = rollElement.find('.dice-total');
    window.test = diceTotal;
    diceTotal[0].innerHTML += ` ${this.type} <button class="damage-button"><i class="fas fa-user-minus" title="Click to apply full damage to selected token(s)."></i></button>`;
    return rollElement[0].outerHTML;
  }

  get total() {
    return this.roll.total;
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
