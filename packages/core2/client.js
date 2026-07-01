// @skullface/core/client.js

// Factory function to instantiate a custom isolated SQLite database file bridge
export function createDatabase (name) {
  return {
    execute: async (statement, values = []) => {
      await window.skullface.sqlite.execute(name, statement, values);
    },
    query: async (statement, values = []) => {
      return await window.skullface.sqlite.query(name, statement, values);
    }
  };
}

// Factory function to instantiate a reactive key-value storage bridge
export function createStore (name) {
  const ipc = window.skullface.store; // dynamic IPC-proxy

  return {
    all     : async () => await ipc.all     (name),
    clear   : async () => await ipc.clear   (name),
    entries : async () => await ipc.entries (name),
    keys    : async () => await ipc.keys    (name),
    load    : async () => await ipc.load    (name),
    save    : async () => await ipc.save    (name),
    size    : async () => await ipc.size    (name),
    values  : async () => await ipc.values  (name),
    
    delete  : async (key) => await ipc.remove (name, key),
    get     : async (key) => await ipc.get    (name, key),
    has     : async (key) => await ipc.has    (name, key),
    
    set     : async (key, value) => await ipc.set    (name, key, value),
    update  : async (data)       => await ipc.update (name, data),
  };
}

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
