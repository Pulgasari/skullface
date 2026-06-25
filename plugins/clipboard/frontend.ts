// plugins/clipboard/frontend.ts

export function copy (text) {
  return window.__skullface_clipboard.copy(text);
}

export function paste () {
  return window.__skullface_clipboard.paste();
}

export function copyHTML (html) {
  return window.__skullface_clipboard.copyHTML(html);
}

export function copyJSON (obj) {
  return window.__skullface_clipboard.copyJSON(obj);
}
