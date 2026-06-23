// plugins/router/frontend.ts

export function addRoute (route) {
  window.__skullface_router.addRoute(route);
}

export function navigate (path) {
  return window.__skullface_router.navigate(path);
}

export function currentPath () {
  return window.__skullface_router.currentPath();
}
