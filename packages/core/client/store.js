// @skullface/core/client/store.js

(function () {
  if (!window.skullface) window.skullface = {};
  //
  window.skullface.createStore = name => {
    const storeIPC = window.skullface.store; // dynamic IPC-proxy
    return {
      all     : async () => await storeIPC.all     (name),
      clear   : async () => await storeIPC.clear   (name),
      entries : async () => await storeIPC.entries (name),
      keys    : async () => await storeIPC.keys    (name),
      load    : async () => await storeIPC.load    (name),
      save    : async () => await storeIPC.save    (name),
      size    : async () => await storeIPC.size    (name),
      values  : async () => await storeIPC.values  (name),
      
      delete  : async (key) => await storeIPC.remove (name, key),
      get     : async (key) => await storeIPC.get    (name, key),
      has     : async (key) => await storeIPC.has    (name, key),
      
      set     : async (key, value) => await storeIPC.set    (name, key, value),
      update  : async (data)       => await storeIPC.update (name, data),
    };
  }
})();
