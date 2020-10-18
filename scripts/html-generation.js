export default async function attackResultHTML(result) {
  try {
    return `
${await result.attackRoll.render()}
${(await Promise.all(result.damageRolls.map(async (roll) => `${roll.type}\n${await roll.roll.render()}`))).join('\n')}
  `;
  }
  catch {
    ui.notifications.error('an error occured in html-generation.attackResultHTML');
    return '';
  }
}
