// @skullface/core/ipc.js

const isFn = sth => typeof sth === 'function';

const bridgeAPI      = {};
const pluginRegistry = new Map (); // registry for skullface-plugins

export const skullface = {

  addCommand (name, body) {
    if (isFn(body)) bridgeAPI[name] = body;
  },
  removeCommand (name) {
    if (bridgeAPI[name]) delete bridgeAPI[name];
  },
  
  createBridge (commands) {
    Object.assign(bridgeAPI, commands);
  },
  
  addPlugin (name, pluginModule) {
    pluginRegistry.set(name, pluginModule);
    this[name] = pluginModule; // enable in backend as skullface.[plugin]
  },
  
  async handleIncomingIPC (messageStr, sendResponseToFrontend) {
    try {
      const { args, id, method, plugin: slug } = JSON.parse(messageStr);
      const plugin = pluginRegistry.get(slug);
      //
      if (!plugin)               throw new Error(`Plugin '${slug}' is not installed.`);
      if (!isFn(plugin[method])) throw new Error(`Method '${method}' doesn't exist in Plugin '${slug}'.`);
      // Führe die echte Deno-Funktion aus
      const data = await plugin[method](...args);
      // Schicke Erfolg zurück
      sendResponseToFrontend({ id, success: true, data });
    } catch (err) {
      sendResponseToFrontend({ id, success: false, error: err.message });
    }
  }
};
export default skullface;

// bridge for custom commands
skullface.addPlugin('bridge', bridgeAPI);

// enable skullface globally in the backend
this.skullface = skullface;
