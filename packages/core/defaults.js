// @skullface/core/defaults.js

// :::::: CONSTANTS

export const DEFAULT_APP_NAME      = 'SkullfaceApp';
export const DEFAULT_TEMPLATE      = 'vanilla';
export const DEFAULT_WINDOW_TITLE  = DEFAULT_APP_NAME;
export const DEFAULT_WINDOW_URL    = 'http://localhost:3000';
export const DEFAULT_WINDOW_HEIGHT =  800;
export const DEFAULT_WINDOW_WIDTH  = 1200;

export const SKULLFACE_URL_REPO     = 'https://github.com/pulgasari/skullface/';
export const SKULLFACE_URL_REPO_ZIP = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;
export const SKULLFACE_URL_DOCS     = 'https://github.com/pulgasari/skullface/docs';

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

// ::::::

export default {
  
  app: {
    name : 'SkullfaceApp',
  },
  
  window: {
    title  : 'SkullfaceApp',
    url    : 'http://localhost:3000',
    height : 768,
    width  : 1024,
  },

  skullface: {
    'url_repo'     : SKULLFACE_URL_REPO,
    'url_repo_zip' : SKULLFACE_URL_REPO_ZIP,
    'url_docs'     : SKULLFACE_URL_DOCS,
  }

}
