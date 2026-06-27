// @skullface/plugins/sqlite/mod.ts

import * as api from "./api.ts";

export default {
  api,
  name  : 'sqlite',
  hooks : {
    onInit () {
      console.log("[sqlite] Plugin successfully loaded.");
    }
  },
};

// :::::: Declare and Register Interface

export interface SQLiteAPI {
  execute (statement: string, values?: any[]): Promise<void>;
  query   (statement: string, values?: any[]): Promise<any[]>;
}

declare global {
  interface Window {
    skullface: {
      sqlite: SQLiteAPI;
    };
  }
}

// optional
// export const sqlite: SQLiteAPI = (window as any).skullface?.sqlite;


