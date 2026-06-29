// @skullface/plugins/clipboard/deno.ts

// :::::: HELPERS

/**
 * Executes a native shell command to communicate with the OS clipboard layer
 */
async function runClipboardCommand (cmd: string, args: string[], stdinText?: string): Promise<string> {
  const command = new Deno.Command(cmd, {
    args,
    stdin: stdinText ? 'piped' : 'null',
    stdout: 'piped',
    stderr: 'piped',
  });

  const process = command.spawn();

  // If we need to pipe text into the utility (like pbcopy)
  if (stdinText && process.stdin) {
    const writer = process.stdin.getWriter();
    await writer.write(new TextEncoder().encode(stdinText));
    await writer.close();
  }

  const { success, stdout, stderr } = await process.output();
  if (!success) {
    const errorMsg = new TextDecoder().decode(stderr);
    throw new Error(`OS Clipboard bridge execution failure: ${errorMsg}`);
  }

  return new TextDecoder().decode(stdout).trim();
}

// :::::: API

export const api = {
  
  async copy (text: string): Promise<void> {
    switch (Deno.build.os) {
      case 'darwin'  : return await runClipboardCommand("pbcopy", [], text);
      case 'windows' : return await runClipboardCommand("powershell", ["-Command", "Set-Clipboard", "-Value", `"${text}"`]);
      default        : return await runClipboardCommand("xclip", ["-selection", "clipboard"], text);
    }
  }

  async paste (): Promise<string> {
    switch (Deno.build.os) {
      case 'darwin'  : return await runClipboardCommand("pbpaste", []);
      case 'windows' : return await runClipboardCommand("powershell", ["-Command", "Get-Clipboard"]);
      default        : return await runClipboardCommand("xclip", ["-selection", "clipboard", "-o"]);
    }
  }

  async copyHTML (html: string): Promise<void> {
    // Fallback wrapper for plain system buffers
    await this.copy(html);
  },

  async copyJSON (obj: any): Promise<void> {
    const jsonStr = JSON.stringify(obj, null, 2);
    await this.copy(jsonStr);
  }
  
};

// :::::: EXPORT

export default {
  api,
  name: 'clipboard',
  hooks: {
    onInit() {
      console.log('[Clipboard] Native Deno clipboard plugin environment initialized.');
    }
  }
};
