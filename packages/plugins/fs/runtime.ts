// plugins/fs/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/fs.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const api = {
    async readText(path) {
      return await Deno.readTextFile(path);
    },

    async writeText(path, text) {
      await Deno.writeTextFile(path, text);
    },

    async readJSON(path) {
      const text = await Deno.readTextFile(path);
      return JSON.parse(text);
    },

    async writeJSON(path, obj) {
      const text = JSON.stringify(obj, null, 2);
      await Deno.writeTextFile(path, text);
    },

    async exists(path) {
      try {
        await Deno.stat(path);
        return true;
      } catch {
        return false;
      }
    },

    async copy(src, dest) {
      await Deno.copyFile(src, dest);
    },

    async remove(path) {
      await Deno.remove(path, { recursive: true });
    },

    async mkdir(path) {
      await Deno.mkdir(path, { recursive: true });
    },

    async walk(path, options = {}) {
      const results = [];
      for await (const entry of Deno.readDir(path)) {
        results.push(entry);
      }
      return results;
    }
  };

  globalThis.__skullface_fs = api;
})();
`;
