// plugins/fs/mod.ts

import { injectRuntime } from "./runtime.ts";

export default {
  name: "fs",

  hooks: {
    onInit() {
      console.log("[fs] initialized");
    },

    onBuildBackend (ctx) {
      injectRuntime(ctx);
    }
  },

  api: {
    readText (path) {
      return globalThis.__skullface_fs.readText(path);
    },

    writeText (path, text) {
      return globalThis.__skullface_fs.writeText(path, text);
    },

    readJSON (path) {
      return globalThis.__skullface_fs.readJSON(path);
    },

    writeJSON (path, obj) {
      return globalThis.__skullface_fs.writeJSON(path, obj);
    },

    exists (path) {
      return globalThis.__skullface_fs.exists(path);
    },

    copy (src, dest) {
      return globalThis.__skullface_fs.copy(src, dest);
    },

    remove (path) {
      return globalThis.__skullface_fs.remove(path);
    },

    mkdir (path) {
      return globalThis.__skullface_fs.mkdir(path);
    },

    walk (path, options) {
      return globalThis.__skullface_fs.walk(path, options);
    }
  }
};
