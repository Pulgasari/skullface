// @skullface/plugins/fs/deno.js

// :::::: API

export const api = {
  async readText (path) {
    return await Deno.readTextFile(path);
  },

  async writeText (path, text) {
    await Deno.writeTextFile(path, text);
  },

  async readJSON (path) {
    const text = await Deno.readTextFile(path);
    return JSON.parse(text);
  },

  async writeJSON (path, obj) {
    const text = JSON.stringify(obj, null, 2);
    await Deno.writeTextFile(path, text);
  },

  async exists (path: string) {
    try        { await Deno.stat(path); return true; }
    catch (_e) { return false; }
  },

  async copy (src, dest) {
    await Deno.copyFile(src, dest);
  },

  async remove (path) {
    await Deno.remove(path, { recursive: true });
  },

  async mkdir (path) {
    await Deno.mkdir(path, { recursive: true });
  },

  async walk (path, _options = {}) {
    const results = [];
    for await (const entry of Deno.readDir(path)) {
      results.push({
        isDirectory : entry.isDirectory,
        isFile      : entry.isFile,
        isSymlink   : entry.isSymlink,
        name        : entry.name,
      });
    }
    return results;
  }
  
};

// :::::: EXPORT

export default {
  api,
  name: 'fs',
  hooks: {
    onInit() {
      console.log('[FS] Native Deno file system plugin environment initialized.');
    }
  }
};
