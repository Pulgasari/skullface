// @skullface/core/mod.ts

import { SkullfaceConfig } from '@/types';
import { SkullfaceWindow } from './window.ts';
import defaults  from './defaults.js';
import skullface from './ipc.ts';
import getPaths  from './paths.ts';


// Constants: Console-Messages
const LOG_BOOT_START          = '[Core] Skullface Runtime environment initializing...';
const WARN_MISSING_CONFIGFILE = '[Core] No skullface.config.js detected. Utilizing fallback configurations.';

export async function bootApp () {
  console.log(LOG_BOOT_START);

  let config: SkullfaceConfig = {};
  try {
    const configPath   = `${Deno.cwd()}/skullface.config.js`;
    const configModule = await import(`file://${configPath}`);
    config = configModule.default;
  } catch (_err) {
    console.warn(WARN_MISSING_CONFIGFILE);
  }

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

  // Dynamically load extensions array listed inside config configuration file
  if (config.plugins && Array.isArray(config.plugins)) {
    for (const pluginSlug of config.plugins) {
      try {
        const pluginSpecifier = `jsr:@skullface/plugins/${pluginSlug}/deno.ts`;
        const pluginModule    = await import(pluginSpecifier);
        const plugin          = pluginModule.default;

        if (plugin && plugin.name && plugin.api) {
          skullface.addPlugin(plugin.name, plugin.api);
          if (plugin.hooks && typeof plugin.hooks.onInit === 'function') {
            plugin.hooks.onInit();
          }
        }
      } catch (err: any) {
        console.error(`[Core] Failed to dynamically load core plugin '${pluginSlug}':`, err.message);
      }
    }
  }

  appWindow.run();
}

// Boot
if (import.meta.main) await bootApp();
