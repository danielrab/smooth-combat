import DamageRollPart from './DamageRollPart.js';

class DamageRollHandler {
  constructor(parts) {
    this.parts = parts;
  }

  async render() {
    return (await Promise.all(this.parts.map((part) => part.render()))).join('\n');
  }

  apply(target) {
    const damage = this.parts.map((part) => part.getDamage(target)).reduce((a, b) => a + b);
    target.actor.applyDamage(damage);
    return damage;
  }
}

export default async function damageRoll(item, versatile, critical) {
  const damageParts = item.data.data.damage.parts;
  const versatileDamagePart = [item.data.data.damage.versatile, damageParts[0][1]];
  const rollParts = await Promise.all(damageParts.map(
    async (part) => DamageRollPart(item, part, critical),
  ));
  const versatileRollPart = await DamageRollPart(item, versatileDamagePart, critical);
  if (versatile) rollParts[0] = versatileRollPart;
  return new DamageRollHandler(rollParts);
}
