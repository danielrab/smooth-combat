/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */

import ensureTargets from './targeting.js';
import attackResultHTML from './html-generation.js';
import attackRoll from './AttackRoll.js';
import damageRoll from './DamageRoll.js';
import settings from './settings.js';

let itemRollOG;
let targetingActive = false;

async function useItem(item, modifiers, target) {
  const attackRollResult = await attackRoll(item, target, modifiers);

  const damageRollResult = await damageRoll(
    item, modifiers.versatile, attackRollResult.critical,
  );

  if (attackRollResult.hits) {
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

  targetingActive = true;
  const targets = await ensureTargets(1);
  targetingActive = false;

  if (targets === null) return false; // do nothing if aborted

  await Promise.all(targets.map(
    async (target) => ChatMessage.create({
      sound: 'sounds/dice.wav',
      content: await attackResultHTML(await useItem(item, modifiers, target)),
    }),
  ));

  return true;
}

function changeMacro(script, itemData) {
  console.log(itemData);
  script.command = `let actor = game.actors.tokens["${itemData.tokenId}"];
if (!actor) actor = game.actors.get("${itemData.actorId}");

let item;
if (actor) item = actor.items.get("${itemData.data._id}");
  
if (item) item.roll();
else game.dnd5e.rollItemMacro("${itemData.data.name}")`;
}

function onItemHotbarDrop(hotbar, data) {
  console.log(data);
  if (data.type !== 'Item') return;
  if (data.data.type !== 'weapon') return;
  Hooks.once('preCreateMacro', (script) => changeMacro(script, data));
}

Hooks.on('hotbarDrop', onItemHotbarDrop);

Hooks.on('init', () => {
  settings.init();

  itemRollOG = game.dnd5e.entities.Item5e.prototype.roll;
  async function itemRollReplacement(options = {}) {
    if (this.data.type === 'weapon') safeUseWeapon(this);
    else itemRollOG.call(this, options);
  }

  game.dnd5e.entities.Item5e.prototype.roll = itemRollReplacement;
});
