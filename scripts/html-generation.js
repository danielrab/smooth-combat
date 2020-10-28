export default async function attackResultHTML(result) {
  return renderTemplate('./modules/smooth-combat/templates/attackResult.hbs', result);
}
