// @skullface/core/preload.js
// (Will be injected into the webview window context)

(function () {
  const pendingRequests = new Map();
  let requestIdCounter = 0;

  // 1. Listen for responses transmitted back from Deno backend
  window.addEventListener('skullface-ipc-response', (event) => {
    const { id, success, data, error } = event.detail;
    if (pendingRequests.has(id)) {
      const { resolve, reject } = pendingRequests.get(id);
      pendingRequests.delete(id);
      success ? resolve(data) : reject(new Error(error));
    }
  });

  // 2. Dynamic RPC call interceptor proxy factory
  const createPluginProxy = plugin => {
    return new Proxy({}, {
      get(target, method) {
        return (...args) => {
          return new Promise((resolve, reject) => {
            const id = requestIdCounter++;
            pendingRequests.set(id, { resolve, reject });
            
            const ipcMessage = { args, id, method, plugin };
            
            // Fixed connection bridge alignment mapping directly to webview bind target
            if (typeof window._skullface_ipc_transmit === 'function') {
              window._skullface_ipc_transmit(JSON.stringify(ipcMessage));
            } else {
              reject(new Error('Skullface IPC bridge layer is missing or uninitialized.'));
            }
          });
        };
      }
    });
  };

  // 3. Establish the global skullface API gateway mapping
  window.skullface = new Proxy({}, {
    get (target, plugin) {
      // Synchronous layout bridge intercept for system paths
      if (plugin === 'paths') {
        return window.__skullface_paths__ || {};
      }
      return createPluginProxy(plugin);
    }
  });
  
})();
