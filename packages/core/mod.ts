// jsr:@skullface/core/mod.ts

import { log, loadPlugins } from './core.ts';
import { getPaths, joinPaths, ensurePathExists } from './paths.ts';
import { createWindow } from './window.ts';

export createWindow;
export ensurePathExists;
export getPaths;
export joinPaths;
export log;
export loadPlugins;

export default {
  createWindow,
  ensurePathExists,
  getPaths,
  joinPaths,
  log,
  loadPlugins,
}

