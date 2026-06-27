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
