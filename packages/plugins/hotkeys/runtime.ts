// plugins/hotkeys/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/hotkeys.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const normalize = (combo) => {
    return combo
      .toLowerCase()
      .replace(/\\s+/g, "")
      .split("+")
      .sort((a, b) => {
        const order = ["ctrl", "alt", "shift", "meta"];
        return order.indexOf(a) - order.indexOf(b);
      })
      .join("+");
  };

  const scopes = new Map();
  let activeScope = null;

  const bindings = new Map();

  const api = {
    register(combo, callback, options = {}) {
      const key = normalize(combo);
      bindings.set(key, { callback, options });
    },

    unregister(combo) {
      bindings.delete(normalize(combo));
    },

    createScope(name) {
      const scope = {
        name,
        enabled: false,
        enable() { this.enabled = true; activeScope = this; },
        disable() { this.enabled = false; if (activeScope === this) activeScope = null; },
        when(fn) { this.condition = fn; return this; }
      };
      scopes.set(name, scope);
      return scope;
    }
  };

  globalThis.__skullface_hotkeys = api;

  window.addEventListener("keydown", (e) => {
    const parts = [];
    if (e.ctrlKey) parts.push("ctrl");
    if (e.altKey) parts.push("alt");
    if (e.shiftKey) parts.push("shift");
    if (e.metaKey) parts.push("meta");
    parts.push(e.key.toLowerCase());

    const combo = normalize(parts.join("+"));
    const binding = bindings.get(combo);
    if (!binding) return;

    const { callback, options } = binding;

    // Scope check
    if (activeScope) {
      if (!activeScope.enabled) return;
      if (activeScope.condition && !activeScope.condition()) return;
    }

    // Condition check
    if (options.when && !options.when()) return;

    e.preventDefault();
    callback(e);
  });
})();
`;
