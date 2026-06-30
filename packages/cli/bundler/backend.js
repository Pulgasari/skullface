// @skullface/cli/bundler/backend.js

import Wizard from '@/wizard';
const wizard = new Wizard ({ prefix: '[Bundler:Backend]' });

// Ermittelt das exakte Target-Triple für 'deno compile'
function getTargetTriple (platform) {
  switch (platform) {
    case 'freebsd' : return 'x86_64-unknown-freebsd';
    case 'linux'   : return 'x86_64-unknown-linux-gnu';
    // Auf dem Mac ermitteln wir dynamisch, ob Intel (x86_64) oder Apple Silicon (aarch64) vorliegt
    case 'mac'     : return Deno.build.arch === 'aarch64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin';
    case 'windows' : return 'x86_64-pc-windows-msvc';
    default        : throw new Error(`Unbekannte Plattform: ${platform}`);
  }
}

// Führt 'deno compile' aus und erzeugt die nackte ausführbare Binärdatei.
// Gibt den absoluten Pfad zur erzeugten Binärdatei zurück.
export async function compileBackend (platform, projectRoot) {
  wizard.print(`Starte 'deno compile' für Target: ${platform}...`);

  const targetTriple = getTargetTriple(platform);
  const tempBuildDir = `${projectRoot}/.skullface-tmp`;
  await Deno.mkdir(tempBuildDir, { recursive: true });
  const binaryExtension  = platform === 'windows' ? '.exe' : '';
  const outputBinaryPath = `${tempBuildDir}/binary_raw${binaryExtension}`;

  // Pfad zum Core-Einstiegspunkt deines Frameworks
  // Wenn deine CLI global läuft, sollte dies idealerweise auf das installierte JSR/Module-File zeigen.
  // Für die lokale Entwicklung nutzen wir den Pfad in deinem Workspace:
  const coreEntry = `${projectRoot}/packages/core/mod.ts`;

  const command = new Deno.Command('deno', {
    args: [
      "compile",
      "--allow-all",
      `--target=${targetTriple}`,
      `--output=${outputBinaryPath}`,
      coreEntry
    ],
    env    : { 'SKULLFACE_ENV': 'production' }, // // HIER setzen wir die Umgebungsvariable für die Produktion!
    stdout : 'inherit',
    stderr : 'inherit',
  });

  const { success, code } = await command.output();
  if (!success) throw new Error(`Deno Compile für ${platform} fehlgeschlagen mit Exit-Code ${code}.`);
  wizard.success(`Native Binärdatei erfolgreich kompiliert.`);
  return outputBinaryPath;
}
