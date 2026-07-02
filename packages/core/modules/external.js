// @skullface/core/modules/external.js

import { getPlatform } from './../utils.js';
const platform = getPlatform();

// :::::: HELPERS

/**
 * Spawns a native OS background process detach-mode shell command
 */
function runCommand (cmd, argsList) {
  new Deno.Command(cmd, { argsList }).spawn();
}

// :::::: API

export async function openFile (path) {
  switch (platform) {
    case 'mac'     : return runCommand('open', [path]);
    case 'windows' : return runCommand('explorer.exe', [path]);
    default        : return runCommand('xdg-open', [path]);
  }
}

export async function openURL (url) {
  switch (platform) {
    case 'mac'     : return runCommand('open', [url]);
    case 'windows' : return runCommand('explorer.exe', [url]);
    default        : return runCommand('xdg-open', [url]);
  }
}

export async function revealFile (path) {
  switch (platform) {
    case 'mac'     : return runCommand('open', ['-R', path]);
    case 'windows' : return runCommand('explorer.exe', ['/select,', path]);
    default        : {
      // Linux & FreeBSD safe fallback: expand path and open enclosing folder
      const folder = path.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
      return runCommand('xdg-open', [folder || '/']);
    }
  }
}

export default {
  openFile,
  openURL,
  revealFile,
}
