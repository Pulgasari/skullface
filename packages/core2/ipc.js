// @skullface/core/ipc.js

import { isFn } from './utils.js';

import clipboard     from './modules/clipboard.js';
import dialogs       from './modules/dialogs.js';
import external      from './modules/external.js';
import filesystem    from './modules/filesystem.js';
import notifications from './modules/notifications.js';
import sqlite        from './modules/sqlite.js';
import store         from './modules/store.js';

//import hotkeys from './modules-client/hotkeys.js';
//import router  from './modules-client/router.js';

// Global Singleton + Bind Modules
const skullface = {
  clipboard,
  dialogs,
  external,
  filesystem,
  notifications,
  sqlite,
  store,
};

// Mechanism to create Custom Commands
skullface.bridge = {};
skullface.addCommand    = (name, body) => { if (isFn(body)) skullface.bridge[name] = body; };
skullface.removeCommand = (name)       => { if (skullface.bridge[name]) delete skullface.bridge[name]; };

// IPC
skullface.handleIncomingIPC = async (messageStr, sendResponseToFrontend) => {
  try {
    const { args, id, method, plugin: slug } = JSON.parse(messageStr);
    const module = skullface[slug];
    //
    if (!module)               throw new Error(`Module '${slug}' is not installed.`);
    if (!isFn(module[method])) throw new Error(`Method '${method}' doesn't exist in Module '${slug}'.`);
    // Führe die echte Deno-Funktion aus
    const data = await module[method](...args);
    // Schicke Erfolg zurück
    sendResponseToFrontend({ id, success: true, data });
  } catch (err) {
    sendResponseToFrontend({ id, success: false, error: err.message });
  }
}

// enable skullface globally in the backend
//this.skullface = skullface;
