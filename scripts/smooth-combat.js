/* eslint-disable no-restricted-globals */

import ensureTargets from './targeting.js';
import attackResultHTML from './html-generation.js';
import { getFuncName } from './util.js';

const fileName = 'smooth-combat.js';
let itemRollOG;
let targetingActive = false;

function isFumble(roll) {
  try {
    const die = roll.terms[0];
    return die.results[0].result <= die.options.fumble;
  }
  catch (e) {
    ui.notifications.error(`an error occured in ${fileName}, in ${getFuncName()}: ${e}`);
    return false;
  }
}

function isCritical(roll) {
  try {
    const die = roll.terms[0];
    return die.results[0].result >= die.options.critical;
  }
  catch (e) {
    ui.notifications.error(`an error occured in ${fileName}, in ${getFuncName()}: ${e}`);
    return false;
  }
}

async function itemDamageRolls(item, versatile, critical) {
  try {
    return Promise.all(item.data.data.damage.parts.map(async (part) => {
      const roll = await game.dnd5e.dice.damageRoll({
        parts: [part[0]], data: item.getRollData(), critical, fastForward: true, chatMessage: false,
      });
      const type = part[1];
      return { roll, type };
    }));
  }
  catch (e) {
    ui.notifications.error(`an error occured in ${fileName}, in ${getFuncName()}: ${e}`);
    return { roll: new Roll('1d1'), type: 'none' };
  }
}

async function useItem(item, modifiers, target) {
  const attackRoll = await item.rollAttack({
    fastForward: true,
    advantage: modifiers.advantage,
    disadvantage: modifiers.disadvantage,
    chatMessage: false,
  });
  const critical = isCritical(attackRoll);
  const fumble = isFumble(attackRoll);

  const damageRolls = await itemDamageRolls(
    item, modifiers.versatile, critical,
  );
  return {
    attackRoll, damageRolls, critical, fumble, target,
  };
}

async function safeUseWeapon(item) {
  if (targetingActive) return ui.notifications.warn('resolve queued targeting first');

  const modifiers = {
    advantage: event.altKey,
    disadvantage: event.ctrlKey,
    versatile: event.shiftKey,
  };

  let targets;
  targetingActive = true;
  try {
    targets = await ensureTargets(1);
  }
  catch (e) {
    ui.notifications.error(`failed to ensure target count: ${e}`);
    itemRollOG.call(item);
    return false;
  }
  finally {
    targetingActive = false;
  }

  if (targets === null) return false; // do nothing if aborted

  await itemRollOG.call(item);

  try {
    await Promise.all(targets.map(
      async (target) => ChatMessage.create({
        content: await attackResultHTML(await useItem(item, modifiers, target)),
      }),
    ));
  }
  catch (e) {
    ui.notifications.error(`failed to create item attack messages: ${e}`);
    return false;
  }

  return true;
}

Hooks.on('init', () => {
  itemRollOG = game.dnd5e.entities.Item5e.prototype.roll;
  async function itemRollReplacement(options = {}) {
    if (this.data.type === 'weapon') safeUseWeapon(this);
    else itemRollOG.call(this, options);
  }

  game.dnd5e.entities.Item5e.prototype.roll = itemRollReplacement;
});
