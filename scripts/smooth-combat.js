/* eslint-disable no-restricted-globals */

import ensureTargets from './targeting.js';
import attackResultHTML from './html-generation.js';
import attackRoll from './AttackRoll.js';
import damageRoll from './DamageRoll.js';

let itemRollOG;
let targetingActive = false;

async function useItem(item, modifiers, target) {
  const attackRollResult = await attackRoll(item, modifiers);

  const damageRollResult = await damageRoll(
    item, modifiers.versatile, attackRollResult.critical,
  );

  if (attackRollResult.hits(target)) {
    await damageRollResult.apply(target);
  }
  return {
    attackRoll: attackRollResult,
    damageRoll: damageRollResult,
    target,
    item,
    actor: item.actor,
  };
}

async function safeUseWeapon(item) {
  if (targetingActive) return ui.notifications.warn('resolve queued targeting first');

  const modifiers = {
    advantage: event.altKey,
    disadvantage: event.ctrlKey,
    versatile: event.shiftKey,
  };

  await itemRollOG.call(item);

  let targets;
  targetingActive = true;
  try {
    targets = await ensureTargets(1);
  }
  catch (e) {
    ui.notifications.error(`failed to ensure target count: ${e}`);
    return false;
  }
  finally {
    targetingActive = false;
  }

  if (targets === null) return false; // do nothing if aborted

  try {
    await Promise.all(targets.map(
      async (target) => ChatMessage.create({
        sound: 'sounds/dice.wav',
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

function changeMacro(script, itemData) {
  const originalCommand = script.command;
  try {
    script.command = `game.actors.get("${itemData.actorId}").items.get("${itemData.data._id}").roll();`;
  }
  catch (e) {
    ui.notifications.error(`failed to change macro: ${e}`);
    script.command = originalCommand;
  }
}

function onItemHotbarDrop(hotbar, data) {
  if (data.type !== 'Item') return;
  if (data.data.type !== 'weapon') return;
  Hooks.once('preCreateMacro', (script) => changeMacro(script, data));
}

Hooks.on('hotbarDrop', onItemHotbarDrop);

Hooks.on('init', () => {
  itemRollOG = game.dnd5e.entities.Item5e.prototype.roll;
  async function itemRollReplacement(options = {}) {
    if (this.data.type === 'weapon') safeUseWeapon(this);
    else itemRollOG.call(this, options);
  }

  game.dnd5e.entities.Item5e.prototype.roll = itemRollReplacement;
});
