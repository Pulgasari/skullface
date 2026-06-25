// plugins/clipboard/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "clipboard",

  hooks: {
    onInit(ctx) {
      console.log("[clipboard] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    copy (text) {
      return globalThis.__skullface_clipboard.copy(text);
    },

    paste () {
      return globalThis.__skullface_clipboard.paste();
    },

    copyHTML (html) {
      return globalThis.__skullface_clipboard.copyHTML(html);
    },

    copyJSON (obj) {
      return globalThis.__skullface_clipboard.copyJSON(obj);
    }
  }
};
