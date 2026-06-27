// @skullface/plugins/sqlite/mod.ts

import * as api from "./api.ts";

export interface SQLiteAPI {
  execute (statement: string, values?: any[]): Promise<void>;
  query   (statement: string, values?: any[]): Promise<any[]>;
}

export default {
  api,
  name  : 'sqlite',
  hooks : {
    onInit () {
      console.log("[sqlite] Plugin successfully loaded.");
    }
  },
};
