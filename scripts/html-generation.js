export default async function attackResultHTML(result) {
  try {
    const attackRollHTML = await result.attackRoll.render();
    const damageRollHTML = await result.damageRoll.render();
    const hit = result.attackRoll.hits(result.target);
    if (hit) {
      return `
${attackRollHTML}
${result.actor.name} hits ${result.target.actor.name} with ${result.item.name} </br>
dealing
${damageRollHTML}
`;
    }
    return `
${await result.attackRoll.render()}
${result.actor.name} misses ${result.target.actor.name}
  `;
  }
  catch (e) {
    ui.notifications.error(`an error occured in html-generation.attackResultHTML: ${e}`);
    return '';
  }
}
