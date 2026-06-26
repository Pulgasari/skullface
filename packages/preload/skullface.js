// packages/preload/skullface.js
// (Will be injected into webview.)

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
