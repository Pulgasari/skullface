// @skullface/core/types.ts

export const commands = {
  'build',
  'create',
  'dev',
  'doctor',
  'plugin',
  'template',
} as const;

export const plugins = [
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

export const templates = [
  'datastar',
  'htmx',
  'preact',
  'react',
  'svelte',
  'vanilla',
  'vanilla-ts',
] as const;

// :::::: TYPES

export type Command  = typeof commands[number];
export type Platform = 'linux' | 'mac' | 'windows';
export type Plugin   = typeof plugins[number];
export type Template = typeof templates[number];

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
