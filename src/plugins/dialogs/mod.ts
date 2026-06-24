// plugins/dialogs/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "dialogs",

  hooks: {
    onInit() {
      console.log("[dialogs] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    pickFile (options) {
      return globalThis.__skullface_dialogs.pickFile(options);
    },

    pickFiles (options) {
      return globalThis.__skullface_dialogs.pickFiles(options);
    },

    pickFolder (options) {
      return globalThis.__skullface_dialogs.pickFolder(options);
    },

    pickSaveLocation (options) {
      return globalThis.__skullface_dialogs.pickSaveLocation(options);
    },

    showMessage (options) {
      return globalThis.__skullface_dialogs.showMessage(options);
    },

    showConfirm (options) {
      return globalThis.__skullface_dialogs.showConfirm(options);
    },

    showError (options) {
      return globalThis.__skullface_dialogs.showError(options);
    }
  }
};
