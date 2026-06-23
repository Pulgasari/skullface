// plugins/router/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "router",

  hooks: {
    onInit () {
      console.log("[router] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    addRoute (route) {
      globalThis.__skullface_router.addRoute(route);
    },

    navigate (path) {
      return globalThis.__skullface_router.navigate(path);
    },

    currentPath () {
      return globalThis.__skullface_router.currentPath();
    }
  }
};
