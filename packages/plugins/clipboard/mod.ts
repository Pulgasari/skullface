// @skullface/plugins/clipboard/mod.ts

import * as api from "./api.ts";

export default {
  api,
  name  : "clipboard",
  hooks : {
    onInit() {
      console.log("[clipboard] Plugin erfolgreich initialisiert.");
    }
  },
};
