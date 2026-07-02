// @skullface/client/router.js

let currentPathState = '/';

// --- INTERNAL ROUTING UTILITIES ---

function matchRoute (routePath, currentPath) {
  const routeParts =   routePath.split('/').filter(Boolean);
  const  pathParts = currentPath.split('/').filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const rp = routeParts[i];
    const cp = pathParts[i];

    if (rp.startsWith(':')) {
      params[rp.slice(1)] = cp;
    } else if (rp !== cp) {
      return null;
    }
  }

  return params;
}

function buildPath (routePath, params = {}) {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, (_, key) => params[key] ?? '');
}

// --- EXPORTED ROUTER API ENGINE ---

export default {
  
  addRoute (route) {
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

      currentPathState = path;
      route.component(params);
      window.history.pushState({}, '', path);
      return;
    }

    console.warn('[Router] No matching route found for path:', path);
  },

  async navigateByName (name, params = {}) {
    const route = routes.find(r => r.name === name);
    if (!route) {
      console.warn('[Router] No route found matching name:', name);
      return;
    }

    const path = buildPath(route.path, params);
    return this.navigate(path);
  },

  currentPath() {
    return currentPathState;
  },
  
};

// Handle standard hardware/browser history actions (back and forward navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    router.navigate(window.location.pathname);
  });
}
