// @skullface/core/mod.ts

import { SkullfaceWindow } from "./window.ts";

// Plugins importieren
import fsPlugin from "../plugins/fs/mod.ts";
import sqlitePlugin from "../plugins/sqlite/mod.ts";
import storePlugin from "../plugins/store/mod.ts";
import clipboardPlugin from "../plugins/clipboard/mod.ts";
import hotkeysPlugin from "../plugins/hotkeys/mod.ts";

// 1. Fenster initialisieren
const appWindow = new SkullfaceWindow({
  title: "Meine Skullface App",
  url: "http://localhost:3000", // Dein Frontend Dev-Server oder dist/index.html
  width: 1200,
  height: 800
});

// 2. Plugins im Core anmelden
appWindow.registerPlugin(fsPlugin.name, fsPlugin.api);
appWindow.registerPlugin(sqlitePlugin.name, sqlitePlugin.api);
appWindow.registerPlugin(storePlugin.name, storePlugin.api);
appWindow.registerPlugin(clipboardPlugin.name, clipboardPlugin.api);
appWindow.registerPlugin(hotkeysPlugin.name, hotkeysPlugin.api);

// 3. Lifecycle-Hooks triggern
fsPlugin.hooks.onInit();
sqlitePlugin.hooks.onInit();
storePlugin.hooks.onInit();
clipboardPlugin.hooks.onInit();
hotkeysPlugin.hooks.onInit();

// 4. App starten!
appWindow.run();
