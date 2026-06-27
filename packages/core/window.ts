// @skullface/core/window.ts

import { skullface } from "./ipc.ts";
import * as     fsPlugin from "../plugins/fs/runtime.ts";
import * as sqlitePlugin from "../plugins/sqlite/runtime.ts";

// 1. Plugins registrieren
skullface.registerPlugin(    "fs",     fsPlugin);
skullface.registerPlugin("sqlite", sqlitePlugin);

// Jetzt kannst du im BACKEND schreiben:
// await skullface.fs.readFile("./test.txt");

// 2. Webview erstellen & IPC verknüpfen
const webview = new MyWebviewLibrary({
  title : "Skullface App",
  url   : "http://localhost:3000",
  preloadScript : "./packages/preload/skullface.js" // Injiziert den Proxy
});

// 3. Auf Nachrichten von der Webview lauschen
webview.onMessage((rawJson) => {
  skullface.handleIncomingIPC(rawJson, (responsePayload) => {
    // Diese Funktion triggert das CustomEvent 'skullface-ipc-response' in der Webview
    webview.eval(`window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: ${JSON.stringify(responsePayload)} }));`);
  });
});

/*
import { Webview } from '@x/webview';

export function createWindow (frontendUrl: string) {
  // 1. Create Instance of Native WebView
  const webview = new Webview();
  webview.title = "Skullface App";
  webview.setSize(800, 600);

  // 2. Read Preload-Script
  // (In production that string gonna be compiled into the binary directly.)
  const preloadCode = Deno.readTextFileSync("./packages/preload/skullface.js");

  // 3. Inject Preload-Script
  // (Runs before every Seitenaufruf.)
  webview.init(preloadCode);

  // 4. Create IPC-Receiver for Deno-Backend
  // (Receives message sent by frontend via 'window.ipc.postMessage'.)
  webview.bind("_skullface_backend_ipc", (message: string) => {
    const { command, data } = JSON.parse(message);
    console.log(`[Skullface Backend] Command received: ${command}`, data);
    
    // Run the commands
    if (command === "writeFile") {
        Deno.writeTextFileSync(data.path, data.content);
        return { success: true };
    }
    return { error: "Unknown command." };
  });

  // 5. Load the App
  webview.navigate(frontendUrl);

  // Keep Window open
  webview.run();
}
*/
