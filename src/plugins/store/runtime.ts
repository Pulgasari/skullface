// plugins/store/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/store.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const stores = new Map();

  function getStorePath (name) {
    return "./store_" + name + ".json";
  }

  function loadFile (path) {
    try {
      const text = Deno.readTextFileSync(path);
      return JSON.parse(text);
    } catch {
      return {};
    }
  }

  function saveFile (path, data) {
    const text = JSON.stringify(data, null, 2);
    Deno.writeTextFileSync(path, text);
  }

  function createStore (name) {
    const path = getStorePath(name);
    let data = loadFile(path);

    return {
      load() {
        data = loadFile(path);
        return data;
      },

      save () {
        saveFile(path, data);
      },

      get (key) {
        return data[key];
      },

      set (key, value) {
        data[key] = value;
      },

      delete (key) {
        delete data[key];
      },

      clear () {
        data = {};
      },

      all () {
        return { ...data };
      }
    };
  }

  const api = {
    createStore
  };

  globalThis.__skullface_store = api;
})();
`;
