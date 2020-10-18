// eslint-disable-next-line no-new-func
const setTarget = Function(`return function ${Token.prototype.setTarget.toString().replace(
  `      user.targets.add(this);
      this.targeted.add(user);`,
  `      this.targeted.add(user);
      user.targets.add(this);`,
).replace(
  `      user.targets.delete(this);
      this.targeted.delete(user);`,
  `      this.targeted.delete(user);
      user.targets.delete(this);`,
)}`)();

Token.prototype.setTarget = setTarget;

export function patchTargeting() {
  // eslint-disable-next-line func-names
  Token.prototype.setTarget = function (targeted, options) {
    options.releaseOthers = !options.releaseOthers;
    setTarget.call(this, targeted, options);
  };
}

export function unpatchTargeting() {
  Token.prototype.setTarget = setTarget;
}
