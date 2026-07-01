// @skullface/core/module/external.js

// :::::: HELPERS

/**
 * Spawns a native OS background process detach-mode shell command
 */
function runCommand (cmd, argsList) {
  new Deno.Command(cmd, { argsList }).spawn();
}

// :::::: API

export default {
  
  async file (path) {
    switch (Deno.build.os) {
      case 'darwin'  : return runCommand('open', [path]);
      case 'windows' : return runCommand('explorer.exe', [path]);
      default        : return runCommand('xdg-open', [path]);
    }
  },

  async url (url) {
    switch (Deno.build.os) {
      case 'darwin'  : return runCommand('open', [url]);
      case 'windows' : return runCommand('explorer.exe', [url]);
      default        : return runCommand('xdg-open', [url]);
    }
  },

  async reveal (path) {
    const os = Deno.build.os;
    if (os === 'windows') {
      runCommand('explorer.exe', ['/select,', path]);
    } else if (os === 'darwin') {
      runCommand('open', ['-R', path]);
    } else {
      // Linux & FreeBSD safe fallback: expand path and open enclosing folder
      const folder = path.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
      runCommand('xdg-open', [folder || '/']);
    }
  }
  
};
