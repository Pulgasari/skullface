// @skullface/cli/bundler/frontend.js

import Wizard from '@/wizard';
const wizard = new Wizard ({ prefix: '[Bundler:Frontend]' });

// Kompiliert die Frontend-Assets des Nutzers (HTML, JS, CSS)
// Führt im Regelfall den Build-Befehl des Frontend-Frameworks aus.
export default async function (projectRoot) {
  wizard.print("Starte Frontend-Build (npm run build)...");
  
  // Does a package.json-file exist?
  try   { await Deno.stat(`${projectRoot}/package.json`); } 
  catch { wizard.warn("Keine package.json im Projektverzeichnis gefunden. Überspringe Frontend-Kompilierung."); return; }

  // Windows verhält sich bei globalen CLI-Befehlen wie 'npm' etwas speziell.
  // Es braucht oft die Dateiendung '.cmd' unter Windows.
  const npmCmd = Deno.build.os === 'windows' ? 'npm.cmd' : 'npm';

  // Run 'npm run build' in the Project Directory
  const command = new Deno.Command(npmCmd, {
    args   : ['run', 'build'],
    cwd    : projectRoot,
    stdout : 'inherit', // Zeigt den Output des Bundlers direkt in der Konsole an
    stderr : 'inherit',
  });

  const { success, code } = await command.output();
  success ? wizard.success('Frontend successfully built.')
          : throw new Error(`Frontend-Build failed with Exit-Code ${code}.`);
  
}
