// @skullface/core/defaults.js

// :::::: CONSTANTS

export const DEFAULT_APP_ICON         = 'src-assets/icon.svg';
export const DEFAULT_APP_NAME         = 'SkullfaceApp';
export const DEFAULT_APP_DIR_ASSETS   = 'src-assets';
export const DEFAULT_APP_DIR_BACKEND  = 'src-backend',
export const DEFAULT_APP_DIR_FRONTEND = 'src-frontend',

export const DEFAULT_BUILD_RUNTIME = 'deno';
export const DEFAULT_BUILD_TARGETS = ['linux'];
 
export const DEFAULT_TEMPLATE = 'vanilla';

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
    icon : DEFAULT_APP_ICON,
    name : DEFAULT_APP_NAME,
    dir  : {
      assets   : DEFAULT_APP_DIR_ASSETS,
      backend  : DEFAULT_APP_DIR_BACKEND,
      frontend : DEFAULT_APP_DIR_FRONTEND,
    }
  },
  
  window: {
    title  : DEFAULT_WINDOW_TITLE,
    url    : DEFAULT_WINDOW_URL,
    height : DEFAULT_WINDOW_HEIGHT,
    width  : DEFAULT_WINDOW_WIDTH,
  },

  skullface: {
    'url_repo'     : SKULLFACE_URL_REPO,
    'url_repo_zip' : SKULLFACE_URL_REPO_ZIP,
    'url_docs'     : SKULLFACE_URL_DOCS,
  }

    }
