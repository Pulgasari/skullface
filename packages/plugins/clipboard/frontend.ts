// @skullface/plugins/clipboard/frontend.ts

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

// Global Shortcut Export
export const clipboard: ClipboardAPI = (window as any).skullface?.clipboard;
