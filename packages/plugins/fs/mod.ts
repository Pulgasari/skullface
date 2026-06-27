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

// :::::: Interface

export interface FileSystemAPI {
  readText  (path: string)                : Promise<string>;
  writeText (path: string, text: string)  : Promise<void>;
  readJSON  (path: string)                : Promise<any>;
  writeJSON (path: string, obj: any)      : Promise<void>;
  exists    (path: string)                : Promise<boolean>;
  copy      (src: string, dest: string)   : Promise<void>;
  remove    (path: string)                : Promise<void>;
  mkdir     (path: string)                : Promise<void>;
  walk      (path: string, options?: any) : Promise<any[]>;
}

declare global {
  interface Window {
    skullface: {
      fs: FileSystemAPI;
    };
  }
}

// to be used like: import { fs } from 'plugins/fs'
// export const fs: FilesystemAPI = (window as any).skullface?.fs;
