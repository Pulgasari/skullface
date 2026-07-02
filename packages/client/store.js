// @skullface/client/store.js

export default function (name) {
  const { ipc } = window.skullface;
  return {
    all     : async () => await window.skullface.ipc('store.all'     , { name }),
    clear   : async () => await window.skullface.ipc('store.clear'   , { name }),
    entries : async () => await window.skullface.ipc('store.entries' , { name }),
    keys    : async () => await window.skullface.ipc('store.keys'    , { name }),
    load    : async () => await window.skullface.ipc('store.load'    , { name }),
    save    : async () => await window.skullface.ipc('store.save'    , { name }),
    size    : async () => await window.skullface.ipc('store.size'    , { name }),
    values  : async () => await window.skullface.ipc('store.values'  , { name }),
      
    delete  : async (key) => await window.skullface.ipc('store.remove' , { name, key }),
    get     : async (key) => await window.skullface.ipc('store.get'    , { name, key }),
    has     : async (key) => await window.skullface.ipc('store.has'    , { name, key }),
      
    set     : async (key, value) => await window.skullface.ipc('store.set'    , { name, key, value }),
    update  : async (data)       => await window.skullface.ipc('store.update' , { name, data }),
  };
}
