// @skullface/core/modules-client/index.js

export { default as hotkeys } from './hotkeys.js';
export { default as router  } from './router.js';

// Factory function to instantiate a custom isolated SQLite database file bridge
export function createDatabase (name) {
  const sqliteIPC = window.skullface.sqlite; // dynamic IPC-proxy
  return {
    execute: async (statement, values = []) => {
      await sqliteIPC.execute(name, statement, values);
    },
    query: async (statement, values = []) => {
      return await sqliteIPC.query(name, statement, values);
    }
  };
}

// Factory function to instantiate a reactive key-value storage bridge
export function createStore (name) {
  const storeIPC = window.skullface.store; // dynamic IPC-proxy
  return {
    all     : async () => await storeIPC.all     (name),
    clear   : async () => await storeIPC.clear   (name),
    entries : async () => await storeIPC.entries (name),
    keys    : async () => await storeIPC.keys    (name),
    load    : async () => await storeIPC.load    (name),
    save    : async () => await storeIPC.save    (name),
    size    : async () => await storeIPC.size    (name),
    values  : async () => await storeIPC.values  (name),
    
    delete  : async (key) => await storeIPC.remove (name, key),
    get     : async (key) => await storeIPC.get    (name, key),
    has     : async (key) => await storeIPC.has    (name, key),
    
    set     : async (key, value) => await storeIPC.set    (name, key, value),
    update  : async (data)       => await storeIPC.update (name, data),
  };
}

/*
if (typeof window !== 'undefined') {
  if (window.skullface) window.skullface = {};
  window.skullface.hotkeys = hotkeys;
}
*/

/*
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

*/
