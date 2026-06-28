// @skullface/plugins/store/api.ts

// :::::: CACHE

const cache = new Map<string, Record<string, any>>();

// :::::: HELPERS

function getStorePath (store: string): string {
  return `./store_${store}.json`;
}

function readFromDisk (store: string): Record<string, any> {
  try {
    const path = getStorePath(store);
    const text = Deno.readTextFileSync(path);
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function writeToDisk (store: string, data: Record<string, any>): void {
  const json = JSON.stringify(data, null, 2);
  const path = getStorePath(store);
  Deno.writeTextFileSync(path, json);
}

function ensureCache (store: string) {
  if (!cache.has(store)) cache.set(store, readFromDisk(store));
}

// :::::: API (for IPC)

export async function load (store: string): Promise<Record<string, any>> {
  const data = readFromDisk(store);
  cache.set(store, data);
  return data;
}

export async function save (store: string): Promise<void> {
  const data = cache.get(store) || {};
  writeToDisk(store, data);
}

export async function get (store: string, key: string): Promise<any> {
  ensureCache(store);
  return cache.get(store)![key];
}

export async function set (store: string, key: string, value: any): Promise<void> {
  ensureCache(store);
  cache.get(store)![key] = value;
}

export async function remove (store: string, key: string): Promise<void> {
  ensureCache(store);
  delete cache.get(store)![key];
}

export async function clear (store: string): Promise<void> {
  cache.set(store, {});
}

export async function all (store: string): Promise<Record<string, any>> {
  ensureCache(store);
  return { ...cache.get(store) };
}

export async function keys (store: string): Promise<string[]> {
  ensureCache(store);
  return Object.keys(cache.get(store)!);
}
