// @skullface/plugins/router/frontend.ts

export interface Route {
  name?: string;
  path: string;
  component: (params?: Record<string, string>) => void;
  beforeEnter?: (params?: Record<string, string>) => boolean | Promise<boolean>;
}

export interface RouterAPI {
  addRoute(route: Route): void;
  navigate(path: string): Promise<void>;
  navigateByName(name: string, params?: Record<string, string>): Promise<void>;
  currentPath(): string;
}

const routes: Route[] = [];
let currentPathState = '/';

// --- INTERNAL ROUTING UTILITIES ---

function matchRoute(routePath: string, currentPath: string): Record<string, string> | null {
  const routeParts = routePath.split('/').filter(Boolean);
  const pathParts = currentPath.split('/').filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

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

function buildPath(routePath: string, params: Record<string, any> = {}): string {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, (_, key) => params[key] ?? '');
}

// --- EXPORTED ROUTER API ENGINE ---

export const router: RouterAPI = {
  addRoute(route: Route): void {
    routes.push(route);
  },

  async navigate (path: string): Promise<void> {
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

  async navigateByName (name: string, params: Record<string, string> = {}): Promise<void> {
    const route = routes.find(r => r.name === name);
    if (!route) {
      console.warn('[Router] No route found matching name:', name);
      return;
    }

    const path = buildPath(route.path, params);
    return this.navigate(path);
  },

  currentPath(): string {
    return currentPathState;
  }
};

// Handle standard hardware/browser history actions (back and forward navigation)
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    router.navigate(window.location.pathname);
  });
}
