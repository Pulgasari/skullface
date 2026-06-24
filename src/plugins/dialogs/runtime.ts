// plugins/dialogs/runtime.ts

export function injectRuntime (ctx) {
  const target = `${ctx.paths.backend}/dialogs.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const os = Deno.build.os;

  async function run(cmd, args) {
    const p = new Deno.Command(cmd, { args }).output();
    const out = await p;
    return new TextDecoder().decode(out.stdout).trim();
  }

  // -------------------------
  // FILE PICKERS
  // -------------------------

  async function pickFile() {
    if (os === "windows") {
      return run("powershell", [
        "-Command",
        "Add-Type -AssemblyName System.Windows.Forms; " +
        "$f = New-Object System.Windows.Forms.OpenFileDialog; " +
        "$f.ShowDialog() | Out-Null; $f.FileName"
      ]);
    }

    if (os === "darwin") {
      return run("osascript", [
        "-e",
        'POSIX path of (choose file)'
      ]);
    }

    return run("zenity", ["--file-selection"]);
  }

  async function pickFiles() {
    if (os === "windows") {
      return run("powershell", [
        "-Command",
        "Add-Type -AssemblyName System.Windows.Forms; " +
        "$f = New-Object System.Windows.Forms.OpenFileDialog; " +
        "$f.Multiselect = $true; " +
        "$f.ShowDialog() | Out-Null; $f.FileNames"
      ]);
    }

    if (os === "darwin") {
      return run("osascript", [
        "-e",
        'choose file with multiple selections allowed'
      ]);
    }

    return run("zenity", ["--file-selection", "--multiple"]);
  }

  async function pickFolder() {
    if (os === "windows") {
      return run("powershell", [
        "-Command",
        "Add-Type -AssemblyName System.Windows.Forms; " +
        "$f = New-Object System.Windows.Forms.FolderBrowserDialog; " +
        "$f.ShowDialog() | Out-Null; $f.SelectedPath"
      ]);
    }

    if (os === "darwin") {
      return run("osascript", [
        "-e",
        'POSIX path of (choose folder)'
      ]);
    }

    return run("zenity", ["--file-selection", "--directory"]);
  }

  async function pickSaveLocation() {
    if (os === "windows") {
      return run("powershell", [
        "-Command",
        "Add-Type -AssemblyName System.Windows.Forms; " +
        "$f = New-Object System.Windows.Forms.SaveFileDialog; " +
        "$f.ShowDialog() | Out-Null; $f.FileName"
      ]);
    }

    if (os === "darwin") {
      return run("osascript", [
        "-e",
        'POSIX path of (choose file name)'
      ]);
    }

    return run("zenity", ["--file-selection", "--save"]);
  }

  // -------------------------
  // MESSAGE DIALOGS
  // -------------------------

  async function showMessage({ title = "Info", body = "" }) {
    if (os === "windows") {
      return run("powershell", [
        "-Command",
        \`Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('\${body}', '\${title}')\`
      ]);
    }

    if (os === "darwin") {
      return run("osascript", [
        "-e",
        \`display dialog "\${body}" with title "\${title}"\`
      ]);
    }

    return run("zenity", ["--info", "--text", body]);
  }

  async function showConfirm({ title = "Confirm", body = "" }) {
    if (os === "windows") {
      const result = await run("powershell", [
        "-Command",
        \`Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('\${body}', '\${title}', 'YesNo')\`
      ]);
      return result.includes("Yes");
    }

    if (os === "darwin") {
      const result = await run("osascript", [
        "-e",
        \`button returned of (display dialog "\${body}" with title "\${title}" buttons {"Cancel", "OK"} default button "OK")\`
      ]);
      return result === "OK";
    }

    const code = await run("zenity", ["--question", "--text", body]);
    return code === "";
  }

  async function showError({ title = "Error", body = "" }) {
    if (os === "windows") {
      return run("powershell", [
        "-Command",
        \`Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('\${body}', '\${title}', 'OK', 'Error')\`
      ]);
    }

    if (os === "darwin") {
      return run("osascript", [
        "-e",
        \`display dialog "\${body}" with title "\${title}" with icon stop\`
      ]);
    }

    return run("zenity", ["--error", "--text", body]);
  }

  // plugins/dialogs/runtime.ts

  function buildWindowsFilter(filters) {
    if (!filters) return "";
    return filters
      .map(f => {
        const extList = f.extensions.map(e => "*." + e).join(";");
        return `${f.name} (${extList})|${extList}`;
      })
      .join("|");
  }
  
  function buildMacFilter(filters) {
    if (!filters) return "";
    return filters.flatMap(f => f.extensions);
  }
  
  function buildLinuxFilter(filters) {
    if (!filters) return [];
    return filters.map(f => {
      const extList = f.extensions.map(e => "*." + e).join(" ");
      return `--file-filter=${f.name} | ${extList}`;
    });
  }

  globalThis.__skullface_dialogs = {
    buildLinuxFilter,
    buildMacFilter
    buildWindowsFilter,
    pickFile,
    pickFiles,
    pickFolder,
    pickSaveLocation,
    showMessage,
    showConfirm,
    showError
  };
})();
`;
