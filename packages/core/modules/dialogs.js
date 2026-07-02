// @skullface/core/modules/dialogs.js

import { getPlatform } from './../utils.js';
const platform = getPlatform();

// :::::: HELPERS

function buildWindowsFilter (filters) {
  if (!filters || filters.length === 0) return '';
  return filters.map(f => {
    const extList = f.extensions.map(e => '*.' + e).join(';');
    return `${f.name} (${extList})|${extList}`;
  }).join('|');
}

function buildMacFilter (filters) {
  return (filters) ? filters.flatMap(f => f.extensions) : [];
}

function buildLinuxFilter (filters) {
  if (!filters) return [];
  return filters.map(f => {
    const extList = f.extensions.map(e => '*.' + e).join(' ');
    return `--file-filter=${f.name} | ${extList}`;
  });
}

async function runCommand (cmd, argsList) {
  const command = new Deno.Command(cmd, {
    argsList,
    stdout: 'piped',
    stderr: 'piped'
  });
  const { stdout } = await command.output();
  return new TextDecoder().decode(stdout).trim();
}

// :::::: API

export const api = {
  
  async pickFile (options = {}) {
    if (platform === 'windows') {
      const filter = buildWindowsFilter(options.filters);
      return await runCommand('powershell', [
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; ${filter ? `$f.Filter = '${filter}';` : ''} $f.ShowDialog() | Out-Null; $f.FileName`
      ]);
    }
    if (platform === 'mac') {
      const types = buildMacFilter(options.filters);
      const filterScript = types.length > 0 ? `of type {${types.map(t => `"${t}"`).join(',')}}` : '';
      return await runCommand('osascript', ['-e', `POSIX path of (choose file ${filterScript})`]);
    }
    // Linux & FreeBSD zenity bridge hook
    const linuxFilters = buildLinuxFilter(options.filters);
    return await runCommand('zenity', ['--file-selection', ...linuxFilters]);
  },

  async pickFiles (options = {}) {
    if (platform === 'windows') {
      const filter = buildWindowsFilter(options.filters);
      const res = await runCommand('powershell', [
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.OpenFileDialog; $f.Multiselect = $true; ${filter ? `$f.Filter = '${filter}';` : ''} $f.ShowDialog() | Out-Null; $f.FileNames -join ','`
      ]);
      return res ? res.split(',') : [];
    }
    if (platform === 'mac') {
      const types = buildMacFilter(options.filters);
      const filterScript = types.length > 0 ? `of type {${types.map(t => `"${t}"`).join(',')}}` : '';
      const res = await runCommand('osascript', ['-e', `set out to {}\nrepeat with f in (choose file ${filterScript} with multiple selections allowed)\ncopy POSIX path of f to end of out\nend repeat\nout -join ","`]);
      return res ? res.split(',') : [];
    }
    const linuxFilters = buildLinuxFilter(options.filters);
    const res = await runCommand('zenity', ['--file-selection', '--multiple', '--separator=,', ...linuxFilters]);
    return res ? res.split(',') : [];
  },

  async pickFolder (_options = {}) {
    switch (platform) {
      case 'mac'     : return await runCommand('osascript', ['-e', 'POSIX path of (choose folder)']);
      case 'windows' : return await runCommand('powershell', ['-Command', 'Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.ShowDialog() | Out-Null; $f.SelectedPath']);
      default        : return await runCommand('zenity', ['--file-selection', '--directory']);
    }
  },

  async pickSaveLocation (options = {}) {
    switch (platform) {
      case 'mac'     : return await runCommand('osascript', ['-e', 'POSIX path of (choose file name)']);
      case 'windows' : 
      default        : return await runCommand('zenity', ['--file-selection', '--save']);
    }
    if (platform === 'windows') {
      const filter = buildWindowsFilter(options.filters);
      return await runCommand('powershell', [
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.SaveFileDialog; ${filter ? `$f.Filter = '${filter}';` : ''} $f.ShowDialog() | Out-Null; $f.FileName`
      ]);
    }
  },

  async showMessage (options) {
    const title = options.title || 'Message';
    switch (platform) {
      case 'mac'     : return await runCommand('osascript', ['-e', `display dialog "${options.body}" with title "${title}" buttons {"OK"} default button "OK"`]);
      case 'windows' : return await runCommand('powershell', ['-Command', `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${options.body}', '${title}')`]);
      default        : return await runCommand('zenity', ['--info', '--text', options.body, `--title=${title}`]);
    }
  },

  async showConfirm (options) {
    const title = options.title || 'Confirm';
    if (platform === 'windows') {
      const res = await runCommand('powershell', ['-Command', `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${options.body}', '${title}', 'YesNo')`]);
      return res === 'Yes';
    }
    if (platform === 'mac') {
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

  async showError (options) {
    const title = options.title || 'Error';
    switch (platform) {
      case 'mac'     : return await runCommand('osascript', ['-e', `display dialog "${options.body}" with title "${title}" with icon stop`]);
      case 'windows' : return await runCommand('powershell', ['-Command', `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('${options.body}', '${title}', 'OK', 'Error')`]);
      default        : return await runCommand('zenity', ['--error', '--text', options.body, `--title=${title}`]);
    }
  }
  
};

export default api;
