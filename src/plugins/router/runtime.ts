// plugins/router/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/router.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const routes = [];
  let current = "/";

  const api = {
    addRoute(route) {
      routes.push(route);
    },

    async navigate(path) {
      const route = routes.find(r => r.path === path);
      if (!route) {
        console.warn("[router] no route for", path);
        return;
      }

      if (route.beforeEnter) {
        const ok = await route.beforeEnter();
        if (!ok) return;
      }

      current = path;
      route.component();
      window.history.pushState({}, "", path);
    },

    currentPath() {
      return current;
    }
  };

  globalThis.__skullface_router = api;

  window.addEventListener("popstate", () => {
    api.navigate(window.location.pathname);
  });
})();
`;
