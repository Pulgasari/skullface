// @skullface/core/window.ts

import { Webview } from "https://deno.land/x/webview/mod.ts";
import { SkullfaceWindowConfig } from '@/types';

export class SkullfaceWindow {
  private webview: Webview;
  private pluginRegistry = new Map<string, any>();

  constructor (config: SkullfaceWindowConfig) {
    // 1. Webview Instanz erzeugen
    this.webview = new Webview(true); // true = Debug-Modus / DevTools erlauben
    this.webview.title = config.title;
    this.webview.size(config.width || 1024, config.height || 768);

    // 2. Preload-Skript laden und injizieren
    this.injectPreloadScript();

    // 3. IPC-Brücke aktivieren
    this.setupIPC();

    // 4. URL ansteuern
    this.webview.navigate(config.url);
  }

  /**
   * Registriert ein Backend-Plugin im Core
   */
  public registerPlugin (pluginName: string, pluginApi: any) {
    this.pluginRegistry.set(pluginName, pluginApi);
    console.log(`[Core] Plugin '${pluginName}' erfolgreich registriert.`);
  }

  /**
   * Liest das Preload-Skript (den Magic Proxy) und injiziert es vor dem Seitenstart
   */
  private injectPreloadScript () {
    try {
      // Pfad zu deinem packages/preload/skullface.js
      const preloadCode = Deno.readTextFileSync("./packages/preload/skullface.js");
      
      // Die meisten Webview-Bibliotheken bieten eine 'init'-Methode,
      // die JS-Code garantiert vor dem Laden des HTML-Doks ausführt.
      this.webview.init(preloadCode);
    } catch (err) {
      console.error("[Core] Fehler beim Laden des Preload-Skripts:", err);
    }
  }

  /**
   * Wartet auf Nachrichten aus dem Frontend und routet sie an die Plugins
   */
  private setupIPC () {
    // Wir binden eine globale Funktion in der Webview, die das Frontend aufrufen kann.
    // In deno:webview heißt das meistens 'bind'
    this.webview.bind("_skullface_ipc_transmit", async (messageStr: string) => {
      try {
        const { id, plugin, method, args } = JSON.parse(messageStr);
        
        // Suchen des passenden Plugins
        const targetPlugin = this.pluginRegistry.get(plugin);
        if (!targetPlugin) {
          throw new Error(`Plugin '${plugin}' ist nicht im Core registriert.`);
        }

        if (typeof targetPlugin[method] !== "function") {
          throw new Error(`Methode '${method}' existiert nicht im Plugin '${plugin}'.`);
        }

        // Führe die echte Deno-Funktion im Backend aus
        const result = await targetPlugin[method](...args);

        // Erfolg zurück an die Webview senden
        this.sendToFrontend({ id, success: true, data: result });

      } catch (error: any) {
        // Fehler zurück an die Webview senden
        this.sendToFrontend({ id, success: false, error: error.message });
      }
    });
  }

  /**
   * Schießt die Antwort als CustomEvent zurück in den Browser-Kontext
   */
  private sendToFrontend (payload: any) {
    const json = JSON.stringify(payload);
    // Wir feuern das Event ab, auf das unser 'skullface.js'-Preload wartet
    this.webview.eval(`
      window.dispatchEvent(new CustomEvent('skullface-ipc-response', { 
        detail: ${json} 
      }));
    `);
  }

  /**
   * Startet die native Ereignisschleife (blockiert, bis das Fenster geschlossen wird)
   */
  public run() {
    this.webview.run();
  }
}
