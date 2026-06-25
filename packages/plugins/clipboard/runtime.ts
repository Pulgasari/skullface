// plugins/clipboard/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/clipboard.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const api = {
    async copy(text) {
      await navigator.clipboard.writeText(text);
    },

    async paste() {
      return await navigator.clipboard.readText();
    },

    async copyHTML(html) {
      const blob = new Blob([html], { type: "text/html" });
      const item = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([item]);
    },

    async copyJSON(obj) {
      const json = JSON.stringify(obj, null, 2);
      await navigator.clipboard.writeText(json);
    }
  };

  globalThis.__skullface_clipboard = api;
})();
`;
