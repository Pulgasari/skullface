// @skullface/core/types.ts

export const REPO_URL = 'https://github.com/pulgasari/skullface';

export const COMMANDS = {
  'build',
  'create',
  'dev',
  'doctor',
  'plugin',
  'template',
} as const;

export const PLATFORMS = {
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
