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

// packages/plugins/store/types.ts

export interface StoreAPI {
  load   ()                        : Promise<Record<string, any>>;
  save   ()                        : Promise<void>;
  get    (key: string)             : Promise<any>;
  set    (key: string, value: any) : Promise<void>;
  delete (key: string)             : Promise<void>;
  clear  ()                        : Promise<void>;
  all    ()                        : Promise<Record<string, any>>;
}
