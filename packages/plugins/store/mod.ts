// plugins/store/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "store",

  hooks: {
    onInit () {
      console.log("[store] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    createStore (name) {
      return globalThis.__skullface_store.createStore(name);
    }
  }
};
