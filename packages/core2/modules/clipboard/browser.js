// @skullface/plugins/clipboard/browser.js

export async function copy (text) {
  await navigator.clipboard.writeText(text);
}

export async function paste () {
  return await navigator.clipboard.readText();
}

export async function copyHTML (html) {
  const blob = new Blob([html], { type: 'text/html' });
  const item = new ClipboardItem({ 'text/html': blob });
  await navigator.clipboard.write([item]);
}

export async function copyJSON (obj) {
  const json = JSON.stringify(obj, null, 2);
  await navigator.clipboard.writeText(json);
}
