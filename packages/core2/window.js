// @skullface/core/window.js

import { Webview } from 'https://deno.land/x/webview/mod.ts';
import defaults  from './defaults.js';
import skullface from './ipc.js';
import getPaths  from './paths.js';

export class SkullfaceWindow {
  private webview;

  constructor (config) {
    const appName = config.appName || defaults.app.name;
    const height  = config.height  || defaults.window.height;
    const width   = config.width   || defaults.window.width;
    const title   = config.title   || defaults.window.title;
    const url     = config.url     || defaults.window.url;
    
    this.webview = new Webview(true);
    this.webview.title = title;
    this.webview.size(width, height);

    // Load, populate path states and initialize bridge scripts
    this.injectPreloadScript(appName);
    this.setupIPC();
    this.webview.navigate(url);
  }
  
  private injectPreloadScript (appName) {
    try {
      const preloadCode = Deno.readTextFileSync('./preload.js');
      
      // Compute paths once and serialize them directly into the window context
      const pathsObj    = getPaths(appName);
      const pathsString = JSON.stringify(pathsObj);
      const pathsCode   = `window.__skullface_paths__ = ${pathsString};`;
      
      // Inject static path data right before evaluation of the proxy handler
      this.webview.init(`${pathsCode}\n${preloadCode}`);
    } catch (err) {
      console.error('[Core] Failed to load or execute preload layer:', err);
    }
  }

  private setupIPC () {
    // Bind central communication wire hook natively into the window frame
    this.webview.bind('_skullface_ipc_transmit', async (messageStr) => {
      // Delegate complete request processing directly to the unified IPC router module
      await skullface.handleIncomingIPC(messageStr, payload => this.sendToFrontend(payload) );
    });
  }
  
  private sendToFrontend (payload) {
    const json = JSON.stringify(payload);
    const code = `window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: ${json} }));`;
    this.webview.eval(code);
  }

  public run() {
    this.webview.run();
  }
}
