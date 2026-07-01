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
  const createModuleProxy = plugin => {
    return new Proxy({}, {
      get (target, method) {
        return (...args) => {
          return new Promise((resolve, reject) => {
            const id = requestIdCounter++;
            pendingRequests.set(id, { resolve, reject });
            
            const ipcMessage = { args, id, method, plugin };
            
            // --- HYBRID IPC BRIDGE ROUTING WIRE ---
            // CASE A: Running inside the native Android App context wrapper
            if (window._skullface_android_transmit) {
              window._skullface_android_transmit.postMessage(jsonPayload);
            } 
            // CASE B: Running inside DesktopWindow context (Windows, Mac, Linux, FreeBSD)
            else if (typeof window._skullface_ipc_transmit === 'function') {
              window._skullface_ipc_transmit(jsonPayload);
            }
            else {
              reject(new Error('Skullface IPC bridge layer is missing or uninitialized.'));
            }
          });
        };
      }
    });
  };

  // 3. Establish the global skullface API gateway mapping
  window.skullface = new Proxy({}, {
    get (target, module) {
      return (module === 'paths')
        ? (window.__skullface_paths__ || {}) // Synchronous local layer access interception for system paths schema metadata
        : createModuleProxy(module);
    }
  });
  
})();
