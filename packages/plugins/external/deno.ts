// @skullface/plugins/external/deno.ts

// :::::: HELPERS

/**
 * Spawns a native OS background process detach-mode shell command
 */
function runCommand (cmd: string, args: string[]) {
  new Deno.Command(cmd, { args }).spawn();
}

// :::::: API

export const api = {
  
  async file (path: string): Promise<void> {
    switch (Deno.build.os) {
      case 'darwin'  : return runCommand('open', [path]);
      case 'windows' : return runCommand('explorer.exe', [path]);
      default        : return runCommand('xdg-open', [path]);
    }
  },

  async url (url: string): Promise<void> {
    switch (Deno.build.os) {
      case 'darwin'  : return runCommand('open', [url]);
      case 'windows' : return runCommand('explorer.exe', [url]);
      default        : return runCommand('xdg-open', [url]);
    }
  },

  async reveal (path: string): Promise<void> {
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

// :::::: EXPORT

export default {
  api,
  name: 'external',
  hooks: {
    onInit() {
      console.log('[External] Native desktop operating system command layer initialized.');
    }
  }
};
