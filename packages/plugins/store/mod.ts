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
