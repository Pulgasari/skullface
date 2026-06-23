// plugins/router/runtime.ts

import { matchRoute, buildPath } from "./utils.ts";

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

    async navigate (path) {
      for (const route of routes) {
        const params = matchRoute(route.path, path);
        if (!params) continue;

        if (route.beforeEnter) {
          const ok = await route.beforeEnter(params);
          if (!ok) return;
        }

        current = path;
        route.component(params);
        window.history.pushState({}, "", path);
        return;
      }

      console.warn("[router] no route for", path);
    },

    async navigateByName (name, params = {}) {
      const route = routes.find(r => r.name === name);
      if (!route) {
        console.warn("[router] no route named", name);
        return;
      }

      const path = buildPath(route.path, params);
      return api.navigate(path);
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
