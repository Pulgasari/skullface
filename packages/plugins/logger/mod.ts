// plugins/logger/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "logger",

  hooks: {
    onInit() {
      console.log("[logger] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    log (level, ...args) {
      globalThis.__skullface_logger.log(level, ...args);
    },

    group (label) {
      return globalThis.__skullface_logger.group(label);
    },

    info (...args) {
      globalThis.__skullface_logger.log("info", ...args);
    },

    warn (...args) {
      globalThis.__skullface_logger.log("warn", ...args);
    },

    error (...args) {
      globalThis.__skullface_logger.log("error", ...args);
    },

    success (...args) {
      globalThis.__skullface_logger.log("success", ...args);
    }
  }
};
