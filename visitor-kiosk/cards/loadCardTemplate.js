export async function loadCardTemplate(path, replacements) {
  const response = await fetch(path);
  const card = await response.json();

  const cardString = JSON.stringify(card);
  const replaced = Object.entries(replacements).reduce((str, [key, value]) =>
    str.replaceAll(`$${key}`, value), cardString);

  return JSON.parse(replaced);
}