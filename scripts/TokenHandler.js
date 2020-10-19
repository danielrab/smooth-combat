export default class TokenHandler {
  constructor(token) {
    this.token = token;
  }

  get hp() {
    return this.token.actor.data.data.attributes.hp.value;
  }

  static fixedPhysical(array) {
    const res = Array.from(array);
    if (res.includes('physical')) res.concat('bludgeoning', 'piercing', 'slashing');
    return res;
  }

  get vulnerabilities() {
    return TokenHandler.fixedPhysical(this.token.actor.data.data.traits.dv.value);
  }

  get resistances() {
    return TokenHandler.fixedPhysical(this.token.actor.data.data.traits.dr.value);
  }

  get immuities() {
    return TokenHandler.fixedPhysical(this.token.actor.data.data.traits.di.value);
  }

  vulnerable(damageType) {
    return this.vulnerabilities.includes(damageType);
  }

  resistant(damageType) {
    return this.resistances.includes(damageType);
  }

  immune(damageType) {
    return this.immuities.includes(damageType);
  }

  damageMultiplier(damageType) {
    let res = 1;
    if (this.immune(damageType)) res = 0;
    if (this.resistant(damageType)) res /= 2;
    if (this.vulnerable(damageType)) res *= 2;
    return res;
  }
}
