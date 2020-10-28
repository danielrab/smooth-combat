import DamageRollPart from './DamageRollPart.js';
import settings from './settings.js';

class DamageRollHandler {
  constructor(parts) {
    this.parts = parts;
  }

  apply(target) {
    const damage = this.parts.map((part) => part.getDamage(target)).reduce((a, b) => a + b);
    if (settings.applyDamage) target.actor.applyDamage(damage);
    return damage;
  }
}

export default async function damageRoll(item, versatile, critical) {
  const damageParts = item.data.data.damage.parts;
  const rollParts = await Promise.all(damageParts.map(
    async (part) => DamageRollPart(item, part, critical),
  ));
  if (versatile && item.data.data.damage.versatile) {
    const versatileDamagePart = [item.data.data.damage.versatile, damageParts[0][1]];
    const versatileRollPart = await DamageRollPart(item, versatileDamagePart, critical);
    rollParts[0] = versatileRollPart;
  }
  return new DamageRollHandler(rollParts);
}
