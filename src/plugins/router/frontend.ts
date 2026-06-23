export function addRoute (route) {
  window.__skullface_router.addRoute(route);
}

export function navigate (path) {
  return window.__skullface_router.navigate(path);
}

export function navigateByName (name, params) {
  return window.__skullface_router.navigateByName(name, params);
}

export function currentPath () {
  return window.__skullface_router.currentPath();
}
