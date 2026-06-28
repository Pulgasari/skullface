// @skullface/core/window.ts

import { Webview } from 'https://deno.land/x/webview/mod.ts';
import { SkullfaceWindowConfig } from '@/types';
import { skullface } from './ipc.ts';
import { getPaths } from './paths.ts';

const DEFAULT_WINDOW_HEIGHT =  768;
const DEFAULT_WINDOW_WIDTH  = 1024;

export class SkullfaceWindow {
  private webview: Webview;

  constructor (config: SkullfaceWindowConfig) {
    const height = config.height || DEFAULT_WINDOW_HEIGHT;
    const width  = config.width  || DEFAULT_WINDOW_WIDTH;
    
    this.webview = new Webview(true);
    this.webview.title = config.title;
    this.webview.size(width, height);

    // Load, populate path states and initialize bridge scripts
    this.injectPreloadScript(config.appName);
    this.setupIPC();
    this.webview.navigate(config.url);
  }
  
  private injectPreloadScript (appName?: string) {
    try {
      const preloadCode = Deno.readTextFileSync('./preload.js');
      
      // Compute paths once and serialize them directly into the window context
      const pathsObj       = getPaths(appName);
      const pathsInjection = `window.__skullface_paths__ = ${JSON.stringify(pathsObj)};`;
      
      // Inject static path data right before evaluation of the proxy handler
      this.webview.init(`${pathsInjection}\n${preloadCode}`);
    } catch (err) {
      console.error('[Core] Failed to load or execute preload layer:', err);
    }
  }

  private setupIPC () {
    // Bind central communication wire hook natively into the window frame
    this.webview.bind('_skullface_ipc_transmit', async (messageStr: string) => {
      // Delegate complete request processing directly to the unified IPC router module
      await skullface.handleIncomingIPC(messageStr, (payload) => { this.sendToFrontend(payload) });
    });
  }
  
  private sendToFrontend (payload: any) {
    const json = JSON.stringify(payload);
    const code = `window.dispatchEvent(new CustomEvent('skullface-ipc-response', { detail: ${json} }));`;
    this.webview.eval(code);
  }

  public run() {
    this.webview.run();
  }
}
