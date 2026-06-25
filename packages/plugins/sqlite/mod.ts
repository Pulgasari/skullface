// plugins/sqlite/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "sqlite",

  hooks: {
    onInit () {
      console.log("[sqlite] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    execute (statement, values = []) {
      return globalThis.__skullface_sqlite.execute(statement, values);
    },

    query (statement, values = []) {
      return globalThis.__skullface_sqlite.query(statement, values);
    }
  }
};
