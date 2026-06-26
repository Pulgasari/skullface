// jsr:@skullface/core/mod.ts

import { createContext, loadConfig, log, loadPlugins } from './core.ts';
import { getPaths, joinPaths, ensurePathExists } from './paths.ts';
import { createWindow } from './window.ts';

export createContext;
export createWindow;
export ensurePathExists;
export getPaths;
export joinPaths;
export loadConfig;
export log;
export loadPlugins;

export default {
  createContext,
  createWindow,
  ensurePathExists,
  getPaths,
  joinPaths,
  loadConfig,
  log,
  loadPlugins,
}

