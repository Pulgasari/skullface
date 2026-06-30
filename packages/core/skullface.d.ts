// @skullface/core/skullface.d.ts

// :::::: PLUGINS

// clipboard

export interface ClipboardAPI {
  copy     (text: string) : Promise<void>;
  copyHTML (html: string) : Promise<void>;
  copyJSON (obj: any)     : Promise<void>;
  paste    ()             : Promise<string>;
}

// fs

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

// hotkeys

export interface HotkeyOptions {
  when?: () => boolean;
}

export interface HotkeyScope {
  name      : string;
  enabled   : boolean;
  enable()  : void;
  disable() : void;
  when(fn: () => boolean): this;
  condition?: () => boolean;
}

export interface HotkeysAPI {
  register(combo: string, callback: (e: KeyboardEvent) => void, options?: HotkeyOptions): void;
  unregister  (combo: string) : void;
  createScope (name: string)  : HotkeyScope;
}

// notifications

export interface NotificationAction {
  action  : string;
  title   : string;
  icon   ?: string;
}

export interface NotificationOptions {
  title    : string;
  body    ?: string;
  icon    ?: string;
  actions ?: NotificationAction[];
}

export interface NotificationsAPI {
  notify            (options: NotificationOptions) : Promise<void>;
  requestPermission ()                             : Promise<boolean>;
}

// router

export interface Route {
  name        ?: string;
  path         : string;
  component    : (params?: Record<string, string>) => void;
  beforeEnter ?: (params?: Record<string, string>) => boolean | Promise<boolean>;
}

export interface RouterAPI {
  addRoute(route: Route): void;
  navigate(path: string): Promise<void>;
  navigateByName(name: string, params?: Record<string, string>): Promise<void>;
  currentPath(): string;
}

// sqlite

export interface SQLiteAPI {
  execute (statement: string, values?: any[]): Promise<void>;
  query   (statement: string, values?: any[]): Promise<any[]>;
}

// store

export interface StoreAPI {
  all     ()                        : Promise<Record<string, any>>;
  clear   ()                        : Promise<void>;
  entries ()                        : Promise<[string, any][]>;
  keys    ()                        : Promise<string[]>;
  load    ()                        : Promise<Record<string, any>>;
  save    ()                        : Promise<void>;
  size    ()                        : Promise<number>;
  values  ()                        : Promise<any[]>;
  
  delete  (key: string)             : Promise<void>;
  get     (key: string)             : Promise<any>;
  has     (key: string)             : Promise<boolean>;
  
  set    (key: string, value: any)   : Promise<void>;
  update (data: Record<string, any>) : Promise<void>;
}

// ::::::: 

export interface SkullfaceAPI {
  clipboard     ?: ClipboardAPI;
  fs            ?: FileSystemAPI;
  hotkeys       ?: HotkeysAPI;
  notifications ?: NotificationsAPI;
  router        ?: RouterAPI;
  sqlite        ?: SQLiteAPI;
  store         ?: StoreAPI;
}

declare global {
  interface Window {
    skullface ?: SkullfaceAPI;
  }
}

/*
export interface SkullfacePlugin {
  id: string;
  setup?(): void;
  dispose?(): void;
}

declare global {
  interface Window {
    skullface ?: SkullfaceAPI;
    registerSkullfacePlugin?: (plugin: SkullfacePlugin) => void;
  }
}
*/
