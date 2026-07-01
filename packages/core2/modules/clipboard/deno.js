// @skullface/core/modules/clipboard/deno.js

const getPlatform = () => Deno.build.os;
const platform = getPlatform();

// :::::: HELPERS

/**
 * Executes a native shell command to communicate with the OS clipboard layer
 */
async function cmd (commandName, argsList, stdinText) {
  const command = new Deno.Command(commandName, {
    argsList,
    stdin  : stdinText ? 'piped' : 'null',
    stdout : 'piped',
    stderr : 'piped',
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
  
  async copy (text) {
    switch (platform) {
      case 'darwin'  : return await cmd("pbcopy", [], text);
      case 'windows' : return await cmd("powershell", ["-Command", "Set-Clipboard", "-Value", `"${text}"`]);
      default        : return await cmd("xclip", ["-selection", "clipboard"], text);
    }
  }

  async paste () {
    switch (platform) {
      case 'darwin'  : return await cmd('pbpaste', []);
      case 'windows' : return await cmd('powershell', ["-Command", "Get-Clipboard"]);
      default        : return await cmd('xclip', ["-selection", "clipboard", "-o"]);
    }
  }

  async copyHTML (html) {
    // Fallback wrapper for plain system buffers
    await this.copy(html);
  },

  async copyJSON (obj) {
    const jsonStr = JSON.stringify(obj, null, 2);
    await this.copy(jsonStr);
  }
  
};

export default api;
