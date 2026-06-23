// plugins/hotkeys/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "hotkeys",

  hooks: {
    onInit (ctx) {
      console.log("[hotkeys] initialized");
    },

    onBuildBackend (ctx) {
      // Inject runtime into backend build folder
      injectRuntime(ctx);
    }
  },

  api: {
    registerHotkey (combo, callback, options = {}) {
      globalThis.__skullface_hotkeys.register(combo, callback, options);
    },

    unregisterHotkey (combo) {
      globalThis.__skullface_hotkeys.unregister(combo);
    },

    createScope (name) {
      return globalThis.__skullface_hotkeys.createScope(name);
    }
  }
};
