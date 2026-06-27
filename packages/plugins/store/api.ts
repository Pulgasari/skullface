// @skullface/plugins/store/api.ts

// Ein Cache für geöffnete Store-Daten im RAM
const storeCache = new Map<string, Record<string, any>>();

function getStorePath(storeName: string): string {
  return `./store_${storeName}.json`;
}

function readFromDisk(storeName: string): Record<string, any> {
  try {
    const text = Deno.readTextFileSync(getStorePath(storeName));
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function writeToDisk(storeName: string, data: Record<string, any>): void {
  Deno.writeTextFileSync(getStorePath(storeName), JSON.stringify(data, null, 2));
}

// --- Ab hier die IPC-kompatiblen, flachen API-Methoden ---

export async function load(storeName: string): Promise<Record<string, any>> {
  const data = readFromDisk(storeName);
  storeCache.set(storeName, data);
  return data;
}

export async function save(storeName: string): Promise<void> {
  const data = storeCache.get(storeName) || {};
  writeToDisk(storeName, data);
}

export async function get(storeName: string, key: string): Promise<any> {
  if (!storeCache.has(storeName)) {
    storeCache.set(storeName, readFromDisk(storeName));
  }
  return storeCache.get(storeName)![key];
}

export async function set(storeName: string, key: string, value: any): Promise<void> {
  if (!storeCache.has(storeName)) {
    storeCache.set(storeName, readFromDisk(storeName));
  }
  storeCache.get(storeName)![key] = value;
}

export async function deleteKey(storeName: string, key: string): Promise<void> {
  if (!storeCache.has(storeName)) {
    storeCache.set(storeName, readFromDisk(storeName));
  }
  delete storeCache.get(storeName)![key];
}

export async function clear(storeName: string): Promise<void> {
  storeCache.set(storeName, {});
}

export async function all(storeName: string): Promise<Record<string, any>> {
  if (!storeCache.has(storeName)) {
    storeCache.set(storeName, readFromDisk(storeName));
  }
  return { ...storeCache.get(storeName) };
}
