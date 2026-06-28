// @skullface/core/mod.ts

import { SkullfaceConfig } from '@/types';
import { SkullfaceWindow } from "./window.ts";

export async function bootApp() {
  console.log("[Core] Skullface Runtime wird gestartet...");

  // 1. skullface.config.js aus dem aktuellen Projektordner des Nutzers laden
  let config: SkullfaceConfig = {};
  try {
    const configPath   = `${Deno.cwd()}/skullface.config.js`;
    const configModule = await import(`file://${configPath}`);
    config = configModule.default;
  } catch (err) {
    console.warn("[Core] Keine 'skullface.config.js' gefunden oder Fehler beim Laden. Nutze Defaults.", err);
  }

  // 2. Fenster mit den Nutzer-Einstellungen (oder Defaults) erstellen
  const appWindow = new SkullfaceWindow({
    title  : config.window?.title  || "Skullface App",
    url    : config.window?.url    || "http://localhost:3000",
    width  : config.window?.width  || 1200,
    height : config.window?.height || 800
  });

  // 3. Plugins DYNAMISCH laden und registrieren
  if (config.plugins && Array.isArray(config.plugins)) {
    for (const pluginName of config.plugins) {
      try {
        console.log(`[Core] Lade Plugin '${pluginName}'...`);

        const pluginSpecifier = `jsr:@skullface/plugins/${pluginName}`;
        const pluginModule    = await import(pluginSpecifier);
        const plugin          = pluginModule.default;

        // Prüfen, ob das importierte Objekt unserem Plugin-Standard entspricht
        if (!plugin || !plugin.name || !plugin.api) {
          throw new Error(`Plugin '${pluginName}' exportiert kein gültiges Skullface-Plugin-Objekt.`);
        }

        // Automatisch im IPC-System registrieren
        appWindow.registerPlugin(plugin.name, plugin.api);

        // Lifecycle-Hook triggern, falls das Plugin einen definiert hat
        if (plugin.hooks && typeof plugin.hooks.onInit === "function") {
          plugin.hooks.onInit();
        }

      } catch (err: any) {
        console.error(`[Core] Fehler beim Laden des Plugins '${pluginName}':`, err.message);
      }
    }
  }

  // 4. App-Fenster öffnen und Main-Loop starten
  appWindow.run();
}

// Ermöglicht den Start via CLI
if (import.meta.main) await bootApp();}
