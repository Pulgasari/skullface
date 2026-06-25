// packages/core/window.ts

import { Webview } from "https://deno.land/x/webview@0.7.6/mod.ts"; // Beispiel-Binding

export function createSkullfaceWindow (frontendUrl: string) {
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
