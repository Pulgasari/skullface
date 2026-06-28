// @skullface/core/preload.js
// (Will be injected into webview.)

(function () {
  let pendingRequests  = new Map(); // save for all pending promises waiting for deno/backend response
  let requestIdCounter = 0;

  // 1. listen to deno/backend responses
  window.addEventListener("skullface-ipc-response", (event) => {
    const { id, success, data, error } = event.detail;
    if (pendingRequests.has(id)) {
      const { resolve, reject } = pendingRequests.get(id);
      pendingRequests.delete(id);
      success ? resolve(data) : reject(new Error(error));
    }
  });

  // 2. RPC-handler
  const createPluginProxy = plugin => {
    return new Proxy({}, {
      get (target, method) {
        // everytime skullface.plugin.methode() gets called:
        return (...args) => {
          return new Promise((resolve, reject) => {
            const id = requestIdCounter++;
            pendingRequests.set(id, { resolve, reject });
            // create IPC-message
            const ipcMessage = { args, id, method, plugin };
            // send it to deno/backend
            if (window.webkit?.messageHandlers?.windowRpc) {
              window.webkit.messageHandlers.windowRpc.postMessage(JSON.stringify(ipcMessage));
            } else if (window.customEmitToDeno) {
              window.customEmitToDeno(ipcMessage);
            }
          });
        };
      }
    });
  };

  // 3. create global skullface-object in the frontend
  window.skullface = new Proxy({}, {
    get (target, plugin) {
      return createPluginProxy(plugin); // dynamic proxy
    }
  });
})();



/*

import paths from './paths.ts';

(() => {
  window.__skullface__ = {
    paths,
    rpc: async (command, data) => {
      const payload = JSON.stringify({ command, data });
      return window.ipc.postMessage(payload);
    }
  };
})();

*/
