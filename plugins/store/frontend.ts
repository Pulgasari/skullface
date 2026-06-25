// plugins/store/frontend.ts

export function createStore (name) {
  return window.__skullface_store.createStore(name);
}
