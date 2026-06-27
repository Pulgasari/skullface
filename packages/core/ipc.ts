// @skullface/core/ipc.ts

// registry for skullface-plugins
const pluginRegistry = new Map<string, any>();

export const skullface = {
  
  registerPlugin (name: string, pluginModule: any) {
    pluginRegistry.set(name, pluginModule);
    (this as any)[name] = pluginModule; // enable in backend as skullface.[plugin]
  },
  
  async handleIncomingIPC (messageStr: string, sendResponseToFrontend: (response: any) => void) {
    try {
      const { id, plugin, method, args } = JSON.parse(messageStr);
      const targetPlugin = pluginRegistry.get(plugin);
      if (!targetPlugin) throw new Error(`Plugin '${plugin}' ist nicht installiert.`);
      if (typeof targetPlugin[method] !== "function") {
        throw new Error(`Method '${method}' doesn't exist in Plugin '${plugin}'.`);
      }

      // Führe die echte Deno-Funktion aus
      const result = await targetPlugin[method](...args);
      // Schicke Erfolg zurück
      sendResponseToFrontend({ id, success: true, data: result });
    } catch (err: any) {
      sendResponseToFrontend({ id, success: false, error: err.message });
    }
  }
};

// enable skullface globally in the backend
(globalThis as any).skullface = skullface;
