// plugins/hotkeys/frontend.ts

export function registerHotkey (combo, callback, options = {}) {
  window.__skullface_hotkeys.register(combo, callback, options);
}

export function unregisterHotkey (combo) {
  window.__skullface_hotkeys.unregister(combo);
}

export function createScope (name) {
  return window.__skullface_hotkeys.createScope(name);
}
