// @skullface/plugins/dialogs/deno.ts

// :::::: TYPES

interface FileFilter {
  name: string;
  extensions: string[];
}

interface OpenDialogOptions {
  filters?: FileFilter[];
  defaultPath?: string;
}

interface MessageDialogOptions {
  title?: string;
  body: string;
}

// :::::: HELPERS

function buildWindowsFilter(filters?: FileFilter[]): string {
  if (!filters || filters.length === 0) return '';
  return filters.map(f => {
    const extList = f.extensions.map(e => '*.' + e).join(';');
    return `${f.name} (${extList})|${extList}`;
  }).join('|');
}

function buildMacFilter(filters?: FileFilter[]): string[] {
  if (!filters) return [];
  return filters.flatMap(f => f.extensions);
}

function buildLinuxFilter(filters?: FileFilter[]): string[] {
  if (!filters) return [];
  return filters.map(f => {
    const extList = f.extensions.map(e => '*.' + e).join(' ');
    return `--file-filter=${f.name} | ${extList}`;
  });
}

async function runCommand(cmd: string, args: string[]): Promise<string> {
  const command = new Deno.Command(cmd, {
    args,
    stdout: 'piped',
    stderr: 'piped'
  });
  const { stdout } = await command.output();
  return new TextDecoder().decode(stdout).trim();
}

// :::::: API

export const api = {
  async pickFile(options: OpenDialogOptions = {}): Promise<string> {
    const os = Deno.build.os;
    if (os === 'windows') {
      const filter = buildWindowsFilter(options.filters);
      return await runCommand('powershell', [
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; ${filter ? `$f.Filter = '${filter}';` : ''} $f.ShowDialog() | Out-Null; $f.FileName`
      ]);
    }
    if (os === 'darwin') {
      const types = buildMacFilter(options.filters);
      const filterScript = types.length > 0 ? `of type {${types.map(t => `"${t}"`).join(',')}}` : '';
      return await runCommand('osascript', ['-e', `POSIX path of (choose file ${filterScript})`]);
    }
    // Linux & FreeBSD zenity bridge hook
    const linuxFilters = buildLinuxFilter(options.filters);
    return await runCommand('zenity', ['--file-selection', ...linuxFilters]);
  },

  async pickFiles(options: OpenDialogOptions = {}): Promise<string[]> {
    const os = Deno.build.os;
    if (os === 'windows') {
      const filter = buildWindowsFilter(options.filters);
      const res = await runCommand('powershell', [
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; $f.Multiselect = $true; ${filter ? `$f.Filter = '${filter}';` : ''} $f.ShowDialog() | Out-Null; $f.FileNames -join ','`
      ]);
      return res ? res.split(',') : [];
    }
    if (os === 'darwin') {
      const types = buildMacFilter(options.filters);
      const filterScript = types.length > 0 ? `of type {${types.map(t => `"${t}"`).join(',')}}` : '';
      const res = await runCommand('osascript', ['-e', `set out to {}\nrepeat with f in (choose file ${filterScript} with multiple selections allowed)\ncopy POSIX path of f to end of out\nend repeat\nout -join ","`]);
      return res ? res.split(',') : [];
    }
    const linuxFilters = buildLinuxFilter(options.filters);
    const res = await runCommand('zenity', ['--file-selection', '--multiple', '--separator=,', ...linuxFilters]);
    return res ? res.split(',') : [];
  },

  async pickFolder(_options: OpenDialogOptions = {}): Promise<string> {
    const os = Deno.build.os;
    if (os === 'windows') {
      return await runCommand('powershell', [
        '-Command',
        'Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.ShowDialog() | Out-Null; $f.SelectedPath'
      ]);
    }
    if (os === 'darwin') {
      return await runCommand('osascript', ['-e', 'POSIX path of (choose folder)']);
    }
    return await runCommand('zenity', ['--file-selection', '--directory']);
  },

  async pickSaveLocation(options: OpenDialogOptions = {}): Promise<string> {
    const os = Deno.build.os;
    if (os === 'windows') {
      const filter = buildWindowsFilter(options.filters);
      return await runCommand('powershell', [
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.SaveFileDialog; ${filter ? `$f.Filter = '${filter}';` : ''} $f.ShowDialog() | Out-Null; $f.FileName`
      ]);
    }
    if (os === 'darwin') {
      return await runCommand('osascript', ['-e', 'POSIX path of (choose file name)']);
    }
    return await runCommand('zenity', ['--file-selection', '--save']);
  },

  async showMessage(options: MessageDialogOptions): Promise<void> {
    const os = Deno.build.os;
    const title = options.title || 'Message';
    if (os === 'windows') {
      await runCommand('powershell', ['-Command', `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${options.body}', '${title}')`]);
    } else if (os === 'darwin') {
      await runCommand('osascript', ['-e', `display dialog "${options.body}" with title "${title}" buttons {"OK"} default button "OK"`]);
    } else {
      await runCommand('zenity', ['--info', '--text', options.body, `--title=${title}`]);
    }
  },

  async showConfirm(options: MessageDialogOptions): Promise<boolean> {
    const os = Deno.build.os;
    const title = options.title || 'Confirm';
    if (os === 'windows') {
      const res = await runCommand('powershell', ['-Command', `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${options.body}', '${title}', 'YesNo')`]);
      return res === 'Yes';
    }
    if (os === 'darwin') {
      try {
        const res = await runCommand('osascript', ['-e', `display dialog "${options.body}" with title "${title}" buttons {"Cancel", "OK"} default button "OK"`]);
        return res.includes('button returned:OK');
      } catch (_e) {
        return false;
      }
    }
    const code = await runCommand('zenity', ['--question', '--text', options.body, `--title=${title}`]);
    return code === '';
  },

  async showError(options: MessageDialogOptions): Promise<void> {
    const os = Deno.build.os;
    const title = options.title || 'Error';
    if (os === 'windows') {
      await runCommand('powershell', ['-Command', `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${options.body}', '${title}', 'OK', 'Error')`]);
    } else if (os === 'darwin') {
      await runCommand('osascript', ['-e', `display dialog "${options.body}" with title "${title}" with icon stop`]);
    } else {
      await runCommand('zenity', ['--error', '--text', options.body, `--title=${title}`]);
    }
  }
};

// :::::: EXPORT

export default {
  api,
  name: 'dialogs',
  hooks: {
    onInit() {
      console.log('[Dialogs] Native desktop multi-backend command engine mounted.');
    }
  }
};
