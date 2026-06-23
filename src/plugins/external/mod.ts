// plugins/external/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "external",

  hooks: {
    onInit () {
      console.log("[external] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    file (path) {
      return globalThis.__skullface_external.openFile(path);
    },

    url (url) {
      return globalThis.__skullface_external.openURL(url);
    },

    reveal (path) {
      return globalThis.__skullface_external.reveal(path);
    }
  }
};
