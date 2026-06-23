// plugins/launch/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "launch",

  hooks: {
    onInit () {
      console.log("[launch] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    file (path) {
      return globalThis.__skullface_launch.openFile(path);
    },

    url (url) {
      return globalThis.__skullface_launch.openURL(url);
    },

    reveal (path) {
      return globalThis.__skullface_launch.reveal(path);
    }
  }
};
