// plugins/notifications/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "notifications",

  hooks: {
    onInit () {
      console.log("[notifications] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    notify (options) {
      return globalThis.__skullface_notifications.notify(options);
    },

    requestPermission () {
      return globalThis.__skullface_notifications.requestPermission();
    }
  }
};
