/* eslint-disable func-names */

Handlebars.registerHelper('ifObject', function (item, options) {
  if (typeof item === 'object') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('when', function (operand1, operator, operand2, options) {
  const operators = {
    eq(l, r) {
      return l === r;
    },
    noteq(l, r) {
      return l !== r;
    },
    gt(l, r) {
      return Number(l) > Number(r);
    },
    or(l, r) {
      return l || r;
    },
    and(l, r) {
      return l && r;
    },
    '%': function (l, r) {
      return (l % r) === 0;
    },
  };
  const result = operators[operator](operand1, operand2);

  if (result) return options.fn(this);
  return options.inverse(this);
});

Hooks.on('init', () => loadTemplates([
  './modules/smooth-combat/templates/rollDetails.hbs',
  './modules/smooth-combat/templates/damageRoll.hbs',
  './modules/smooth-combat/templates/roll.hbs',
]));
