export default async function attackResultHTML(result) {
  try {
    const attackRollHTML = await result.attackRoll.render();
    const damageRollHTML = (await Promise.all(result.damageRolls.map(async (roll) => `${await roll.roll.render()}\n${roll.type} damge`))).join('\n');
    const hit = result.attackRoll.total >= result.target.actor.data.data.attributes.ac.value;
    if (hit) {
      return `
${attackRollHTML}
${result.actor.name} hits ${result.target.actor.name} with ${result.item.name} </br>
and deals
${damageRollHTML}
`;
    }
    return `
${await result.attackRoll.render()}
${result.actor.name} misses ${result.target.actor.name}
  `;
  }
  catch {
    ui.notifications.error('an error occured in html-generation.attackResultHTML');
    return '';
  }
}
