/* eslint-disable no-new-func */
/* eslint-disable func-names */

function swap(string, substring1, substring2) {
  let res = string;
  res = res.replace(substring1, '__placeholder__');
  res = res.replace(substring2, substring1);
  res = res.replace('__placeholder__', substring2);
  return res;
}

// #region targeting
let setTargetText = Token.prototype.setTarget.toString();
setTargetText = swap(setTargetText, 'this.targeted.add(user)', 'user.targets.add(this)');
setTargetText = swap(setTargetText, 'this.targeted.delete(user)', 'user.targets.delete(this)');
const setTarget = Function(`return function ${setTargetText}`)();

Token.prototype.setTarget = setTarget;

export function patchTargeting() {
  Token.prototype.setTarget = function (targeted, options) {
    options.releaseOthers = !options.releaseOthers;
    setTarget.call(this, targeted, options);
  };
}

export function unpatchTargeting() {
  Token.prototype.setTarget = setTarget;
}
// #endregion

// #region actor
function fixedPhysical(array) {
  let res = Array.from(array);
  if (res.includes('physical')) res = res.concat('bludgeoning', 'piercing', 'slashing');
  return res;
}

Object.defineProperty(Actor.prototype, 'vulnerabilities', { get() {
  return fixedPhysical(this.data.data.traits.dv.value);
} });
Object.defineProperty(Actor.prototype, 'resistances', { get() {
  return fixedPhysical(this.data.data.traits.dr.value);
} });
Object.defineProperty(Actor.prototype, 'immuities', { get() {
  return fixedPhysical(this.data.data.traits.di.value);
} });

Actor.prototype.vulnerable = function (damageType) {
  return this.vulnerabilities.includes(damageType);
};
Actor.prototype.resistant = function (damageType) {
  return this.resistances.includes(damageType);
};
Actor.prototype.immune = function (damageType) {
  return this.immuities.includes(damageType);
};

Actor.prototype.damageMultiplier = function (damageType) {
  let res = 1;
  if (this.immune(damageType)) res = 0;
  if (this.resistant(damageType)) res /= 2;
  if (this.vulnerable(damageType)) res *= 2;
  return res;
};
// #endregion
