// @skullface/core/index.js

import { SkullfaceWindow } from './window.js';
import defaults  from './defaults.js';
import skullface from './ipc.js';
import getPaths  from './paths.js';

// Constants
const CONFIG_PATH = `${Deno.cwd()}/skullface.config.js`;

// Constants: Console-Messages
const LOG_BOOT_START          = '[Core] Skullface Runtime environment initializing...';
const WARN_MISSING_CONFIGFILE = '[Core] No skullface.config.js detected. Utilizing fallback configurations.';

export async function bootApp () {
  console.log(LOG_BOOT_START);

  let config = {};
  try       { config = (await import(`file://${CONFIG_PATH}`)).default; }
  catch (e) { console.warn(WARN_MISSING_CONFIGFILE); }

  const appName = config.app?.name || defaults.app.name;
  
  // Bind paths to global skullface instance in the backend right before window creation
  skullface.paths = getPaths(appName);

  const appWindow = new SkullfaceWindow ({
    title   : config.window?.title  || defaults.window.name,
    url     : config.window?.url    || defaults.window.url,
    width   : config.window?.width  || defaults.window.width,
    height  : config.window?.height || defaults.window.height,
    appName : appName
  });

  appWindow.run();
}

// Boot
if (import.meta.main) await bootApp();
