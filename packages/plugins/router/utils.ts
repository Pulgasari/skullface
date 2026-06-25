// plugins/router/utils.ts

export function matchRoute (routePath, currentPath) {
  const routeParts = routePath.split("/").filter(Boolean);
  const pathParts = currentPath.split("/").filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const rp = routeParts[i];
    const cp = pathParts[i];

    if (rp.startsWith(":")) {
      params[rp.slice(1)] = cp;
    } else if (rp !== cp) {
      return null;
    }
  }

  return params;
}

export function buildPath (routePath, params = {}) {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, (_, key) => params[key]);
}
