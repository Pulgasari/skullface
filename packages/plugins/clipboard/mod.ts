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

// :::::: INTERFACE

// packages/plugins/clipboard/types.ts

export interface ClipboardAPI {
  copy     (text: string) : Promise<void>;
  copyHTML (html: string) : Promise<void>;
  copyJSON (obj: any)     : Promise<void>;
  paste    ()             : Promise<string>;
}

declare global {
  interface Window {
    skullface: {
      clipboard: ClipboardAPI;
    };
  }
}

// additional usage: import { clipboard } from "plugins/clipboard";
export const clipboard: ClipboardAPI = (window as any).skullface?.clipboard;
