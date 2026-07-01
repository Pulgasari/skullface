// @skullface/plugins/store/deno.js

// :::::: CACHE

const cache = new Map ();

// :::::: HELPERS

function getStorePath (store) {
  return `./store_${store}.json`;
}

function readFromDisk (store) {
  try {
    const path = getStorePath(store);
    const text = Deno.readTextFileSync(path);
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function writeToDisk (store, data) {
  const json = JSON.stringify(data, null, 2);
  const path = getStorePath(store);
  Deno.writeTextFileSync(path, json);
}

function ensureCache (store) {
  if (!cache.has(store)) cache.set(store, readFromDisk(store));
}

// :::::: API (for IPC)

const api = {
  
  async load (store) {
    const data = readFromDisk(store);
    cache.set(store, data);
    return data;
  },
  
  async save (store) {
    const data = cache.get(store) || {};
    writeToDisk(store, data);
  },

  async get (store, key) {
    ensureCache(store);
    return cache.get(store)[key];
  },

  async set (store, key, value) {
    ensureCache(store);
    cache.get(store)![key] = value;
    notify(store, key, value);
  },

  async remove (store, key) {
    ensureCache(store);
    delete cache.get(store)![key];
    notify(store, key, undefined);
  },

  async clear (store) {
    cache.set(store, {});
  },

  async all (store) {
    ensureCache(store);
    return { ...cache.get(store) };
  },

  async entries (store) {
    ensureCache(store);
    return Object.entries(cache.get(store));
  },
  
  async keys (store) {
    ensureCache(store);
    return Object.keys(cache.get(store));
  },

  async values (store) {
    ensureCache(store);
    return Object.values(cache.get(store));
  },
  
  async has (store, key) {
    ensureCache(store);
    return Object.prototype.hasOwnProperty.call(cache.get(store), key);
  },

  async size (store) {
    ensureCache(store);
    return Object.keys(cache.get(store)).length;
  },

  async update (store, data) {
    ensureCache(store);
    const obj = cache.get(store);
  
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) {
        delete obj[key];
        notify(store, key, undefined);
      } else {
        obj[key] = value;
        notify(store, key, value);
      }
    }
  },

}

// :::::: WATCH

const watchers = new Map ();

function notify (store, key, value) {
  const set = watchers.get(store);
  if (set) for (const fn of set) fn(key, value);
}

api.watch = (store, callback) => {
  if (!watchers.has(store)) watchers.set(store, new Set());
  watchers.get(store).add(callback);
  return () => watchers.get(store).delete(callback); // optional: unsubscribe function
}

// :::::: EXPORT

export default {
  api,
  name  : 'store',
  hooks : {
    onInit() {
      console.log('[store] plugin successfully loaded.');
    }
  },
};
