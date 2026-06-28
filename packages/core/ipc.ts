// @skullface/core/ipc.ts

const bridgeApi: Record<string, Function> = {};
const pluginRegistry = new Map<string, any>(); // registry for skullface-plugins

export const skullface = {

  paths: {} as ReturnType<typeof import('./paths.ts').getPaths>,

  registerBridge (commands: Record<string, Function>) {
    Object.assign(bridgeApi, commands);
  },
  
  registerPlugin (name: string, pluginModule: any) {
    pluginRegistry.set(name, pluginModule);
    (this as any)[name] = pluginModule; // enable in backend as skullface.[plugin]
  },
  
  async handleIncomingIPC (messageStr: string, sendResponseToFrontend: (response: any) => void) {
    try {
      const { args, id, method, plugin: slug } = JSON.parse(messageStr);
      const plugin = pluginRegistry.get(slug);
      if (!plugin) throw new Error(`Plugin '${slug}' is not installed.`);
      if (typeof plugin[method] !== "function") throw new Error(`Method '${method}' doesn't exist in Plugin '${slug}'.`);
      // Führe die echte Deno-Funktion aus
      const result = await plugin[method](...args);
      // Schicke Erfolg zurück
      sendResponseToFrontend({ id, success: true, data: result });
    } catch (err: any) {
      sendResponseToFrontend({ id, success: false, error: err.message });
    }
  }
};
export default skullface;

// bridge for custom commands
skullface.registerPlugin('bridge', bridgeApi);

// enable skullface globally in the backend
(globalThis as any).skullface = skullface;
