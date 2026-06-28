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
  all    ()                        : Promise<Record<string, any>>;
  load   ()                        : Promise<Record<string, any>>;
  clear  ()                        : Promise<void>;
  save   ()                        : Promise<void>;
  delete (key: string)             : Promise<void>;
  get    (key: string)             : Promise<any>;
  set    (key: string, value: any) : Promise<void>;
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
  const ipc = (window as any).skullface.store; // dynamic IPC-proxy

  return {
    all    : async () => await ipc.all   (name),
    clear  : async () => await ipc.clear (name),
    keys   : async () => await ipc.keys  (name),
    load   : async () => await ipc.load  (name),
    save   : async () => await ipc.save  (name),
    delete : async (key: string)             => await ipc.remove (name, key),
    get    : async (key: string)             => await ipc.get    (name, key),
    set    : async (key: string, value: any) => await ipc.set    (name, key, value),
  };
}
