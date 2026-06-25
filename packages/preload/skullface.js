// packages/preload/skullface.js
// (Will be injected into webview.)

(() => {
  window.__skullface__ = {
    rpc: async (command, data) => {
      const payload = JSON.stringify({ command, data });
      return window.ipc.postMessage(payload);
    }
  };
})();
