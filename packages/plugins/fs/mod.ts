// @skullface/plugins/fs/mod.ts

import * as api from './api.ts';

export default {
  api,
  name  : 'fs',
  hooks : {
    onInit() {
      console.log("[fs] Plugin erfolgreich initialisiert.");
    }
  },
};
