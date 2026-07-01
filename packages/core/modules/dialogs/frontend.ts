// @skullface/plugins/dialogs/frontend.ts

export interface FileFilter {
  extensions : string[];
  name       : string;
  
}

export interface MessageDialogOptions {
  body   : string;
  title ?: string;
}

export interface OpenDialogOptions {
  defaultPath ?: string;
  filters     ?: FileFilter[];
}

export interface DialogsAPI {
  pickFile         (options?: OpenDialogOptions)    : Promise<string>;
  pickFiles        (options?: OpenDialogOptions)    : Promise<string[]>;
  pickFolder       (options?: OpenDialogOptions)    : Promise<string>;
  pickSaveLocation (options?: OpenDialogOptions)    : Promise<string>;
  showMessage      (options : MessageDialogOptions) : Promise<void>;
  showConfirm      (options : MessageDialogOptions) : Promise<boolean>;
  showError        (options : MessageDialogOptions) : Promise<void>;
}

declare global {
  interface Window {
    skullface: {
      dialogs: DialogsAPI;
    };
  }
}

// Global Shortcut Export
export const dialogs: DialogsAPI = (window as any).skullface?.dialogs;
