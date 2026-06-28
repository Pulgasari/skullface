// @skullface/plugins/store/deno.ts

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
  notify(store, key, value);
}

export async function remove (store: string, key: string): Promise<void> {
  ensureCache(store);
  delete cache.get(store)![key];
  notify(store, key, undefined);
}

export async function clear (store: string): Promise<void> {
  cache.set(store, {});
}

export async function all (store: string): Promise<Record<string, any>> {
  ensureCache(store);
  return { ...cache.get(store) };
}

export async function entries (store: string): Promise<[string, any][]> {
  ensureCache(store);
  return Object.entries(cache.get(store)!);
}

export async function keys (store: string): Promise<string[]> {
  ensureCache(store);
  return Object.keys(cache.get(store)!);
}

export async function values (store: string): Promise<any[]> {
  ensureCache(store);
  return Object.values(cache.get(store)!);
}

export async function has (store: string, key: string): Promise<boolean> {
  ensureCache(store);
  return Object.prototype.hasOwnProperty.call(cache.get(store)!, key);
}

export async function size (store: string): Promise<number> {
  ensureCache(store);
  return Object.keys(cache.get(store)!).length;
}

export async function update (store: string, data: Record<string, any>): Promise<void> {
  ensureCache(store);
  const obj = cache.get(store)!;

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      delete obj[key];
      notify(store, key, undefined);
    } else {
      obj[key] = value;
      notify(store, key, value);
    }
  }
}

// :::::: WATCH

const watchers = new Map<string, Set<(key: string, value: any) => void>>();

function notify (store: string, key: string, value: any) {
  const set = watchers.get(store);
  if (set) for (const fn of set) fn(key, value);
}

export function watch (store: string, fn: (key: string, value: any) => void) {
  if (!watchers.has(store)) watchers.set(store, new Set());
  watchers.get(store)!.add(fn);
  return () => watchers.get(store)!.delete(fn); // optional: unsubscribe function
}
