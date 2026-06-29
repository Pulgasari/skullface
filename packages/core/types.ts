// @skullface/core/types.ts

// :::::: CONSTANTS

export const DEFAULT_APP_NAME      = 'SkullfaceApp';
export const DEFAULT_TEMPLATE      = 'vanilla';
export const DEFAULT_WINDOW_TITLE  = DEFAULT_APP_NAME;
export const DEFAULT_WINDOW_URL    = 'http://localhost:3000';
export const DEFAULT_WINDOW_HEIGHT =  800;
export const DEFAULT_WINDOW_WIDTH  = 1200;
export const REPO_URL              = 'https://github.com/pulgasari/skullface/';
export const REPO_ZIP_URL          = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;
export const DOCS_URL              = 'https://github.com/pulgasari/skullface/docs';
export const TEMPLATE_PATH_PART    = 'skullface-main/templates/vanilla/'; // stupid

// :::::: LISTS

export const COMMANDS = {
  'build',
  'create',
  'dev',
  'doctor',
  'plugin',
  'template',
} as const;

export const PLATFORMS = {
  'android',
  'freebsd',
  'linux',
  'mac',
  'windows',
} as const;

export const PLUGINS = [
  "clipboard",
  "dialogs",
  "external",
  "fs",
  "hotkeys",
  "logger",
  "notifications",
  "router",
  "sqlite",
  "store",
] as const;

export const TEMPLATES = [
  'datastar',
  'htmx',
  'preact',
  'react',
  'svelte',
  'vanilla',
  'vanilla-ts',
] as const;

// :::::: TYPES

export type Command  = typeof COMMANDS[number];
export type Platform = typeof PLATFORMS[number];
export type Plugin   = typeof PLUGINS[number];
export type Template = typeof TEMPLATES[number];

// :::::: INTERFACES

export interface SkullfaceConfig {
  plugins? : string[];
  window?  : {
    title?  : string;
    url?    : string;
    width?  : number;
    height? : number;
  };
}

interface SkullfaceWindowConfig {
  title   : string;
  url     : string;
  width?  : number;
  height? : number;
}
