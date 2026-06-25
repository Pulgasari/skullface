// plugins/external/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/external.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const os = Deno.build.os;

  function run(cmd, args) {
    const p = new Deno.Command(cmd, { args }).spawn();
    return p.status;
  }

  const api = {
    async openFile(path) {
      if (os === "windows") return run("explorer.exe", [path]);
      if (os === "darwin")  return run("open", [path]);
      return run("xdg-open", [path]);
    },

    async openURL(url) {
      if (os === "windows") return run("explorer.exe", [url]);
      if (os === "darwin")  return run("open", [url]);
      return run("xdg-open", [url]);
    },

    async reveal (path) {
      if (os === "windows") return run("explorer.exe", ["/select,", path]);
      if (os === "darwin")  return run("open", ["-R", path]);
      // Linux: highlight nicht möglich → Ordner öffnen
      const folder = path.replace(/\\/g, "/").split("/").slice(0, -1).join("/");
      return run("xdg-open", [folder]);
    }
  };

  globalThis.__skullface_launch = api;
})();
`;
