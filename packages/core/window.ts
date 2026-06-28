// @skullface/core/window.ts

import { Webview } from "https://deno.land/x/webview/mod.ts";
import { SkullfaceWindowConfig } from '@/types';

const DEFAULT_WINDOW_HEIGHT =  768;
const DEFAULT_WINDOW_WIDTH  = 1024;

export class SkullfaceWindow {
  private webview: Webview;
  private registry = new Map<string, any>();

  constructor (config: SkullfaceWindowConfig) {
    this.webview = new Webview(true); // true = Debug-Modus / DevTools erlauben
    this.webview.title = config.title;
    this.webview.size(config.width || DEFAULT_WINDOW_WIDTH, config.height || DEFAULT_WINDOW_HEIGHT);

    this.injectPreloadScript(); // Preload-Skript laden und injizieren
    this.setupIPC(); // IPC-Brücke aktivieren
    this.webview.navigate(config.url); // URL ansteuern
  }
  
  public registerPlugin (pluginName: string, pluginApi: any) {
    this.registry.set(pluginName, pluginApi);
    console.log(`[Core] Plugin '${pluginName}' erfolgreich registriert.`);
  }
  
  private injectPreloadScript () {
    try {
      const preloadCode = Deno.readTextFileSync("./packages/preload/skullface.js");
      this.webview.init(preloadCode);
    } catch (err) {
      console.error("[Core] Fehler beim Laden des Preload-Skripts:", err);
    }
  }

  private setupIPC () {
    // Wir binden eine globale Funktion in der Webview, die das Frontend aufrufen kann.
    // In deno:webview heißt das meistens 'bind'
    this.webview.bind("_skullface_ipc_transmit", async (messageStr: string) => {
      try {
        const { id, plugin, method, args } = JSON.parse(messageStr);
        const targetPlugin = this.registry.get(plugin);
        if (!targetPlugin) throw new Error(`Plugin '${plugin}' ist nicht im Core registriert.`);
        if (typeof targetPlugin[method] !== "function") {
          throw new Error(`Methode '${method}' existiert nicht im Plugin '${plugin}'.`);
        }

        // Führe die echte Deno-Funktion im Backend aus
        const result = await targetPlugin[method](...args);
        this.sendToFrontend({ id, success: true, data: result });
      } catch (error: any) {
        this.sendToFrontend({ id, success: false, error: error.message });
      }
    });
  }
  
  private sendToFrontend (payload: any) {
    const json = JSON.stringify(payload);
    const code = `window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: ${json} }));`;
    this.webview.eval(code); // Wir feuern das Event ab, auf das unser 'skullface.js'-Preload wartet
  }
  
  public run() {
    this.webview.run();
  }
}
