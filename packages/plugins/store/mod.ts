// @skullface/plugins/store/mod.ts

import * as api from "./api.ts";

export default {
  api,
  name  : "store",
  hooks : {
    onInit() {
      console.log("[store] Plugin erfolgreich geladen.");
    }
  },
};

// :::::: INTERFACE

export interface StoreAPI {
  load   ()                        : Promise<Record<string, any>>;
  save   ()                        : Promise<void>;
  get    (key: string)             : Promise<any>;
  set    (key: string, value: any) : Promise<void>;
  delete (key: string)             : Promise<void>;
  clear  ()                        : Promise<void>;
  all    ()                        : Promise<Record<string, any>>;
}

declare global {
  interface Window {
    skullface: {
      store: {
        createStore(name: string): StoreAPI;
      };
    };
  }
}

// :::::: FRONTEND

export function createStore (name: string): StoreAPI {
  // Zugriff auf den dynamischen IPC-Proxy für dieses Plugin
  const ipc = (window as any).skullface.store;

  return {
    async load() {
      return await ipc.load(name);
    },
    async save() {
      await ipc.save(name);
    },
    async get(key: string) {
      return await ipc.get(name, key);
    },
    async set(key: string, value: any) {
      await ipc.set(name, key, value);
    },
    async delete(key: string) {
      // Wir mappen das frontendseitige 'delete' auf die Backend-Funktion 'deleteKey'
      await ipc.deleteKey(name, key);
    },
    async clear() {
      await ipc.clear(name);
    },
    async all() {
      return await ipc.all(name);
    }
  };
}
