// @skullface/plugins/fs/frontend.ts

export interface FileSystemAPI {
  readJSON  (path: string)                : Promise<any>;
  readText  (path: string)                : Promise<string>;
  writeJSON (path: string, obj: any)      : Promise<void>;
  writeText (path: string, text: string)  : Promise<void>;
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

// Global Shortcut Export
export const fs: FileSystemAPI = (window as any).skullface?.fs;

/* TODO:

--- create methods
ensureDir
hash
isDir
isFile

--- create aliases:
createDir
makeDir
move

*/
