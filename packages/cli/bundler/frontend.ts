// @skullface/cli/bundler/frontend.ts

import wizard from '@/wizard';

/**
 * Kompiliert die Frontend-Assets des Nutzers (HTML, JS, CSS)
 * Führt im Regelfall den Build-Befehl des Frontend-Frameworks aus.
 */
export async function buildFrontend (projectRoot: string): Promise<void> {
  console.log("[Bundler:Frontend] Starte Frontend-Build (npm run build)...");
  
  // Does a package.json-file exist?
  try   { await Deno.stat(`${projectRoot}/package.json`); } 
  catch { console.warn("[Bundler:Frontend] Keine package.json im Projektverzeichnis gefunden. Überspringe Frontend-Kompilierung."); return; }

  // Windows verhält sich bei globalen CLI-Befehlen wie 'npm' etwas speziell.
  // Es braucht oft die Dateiendung '.cmd' unter Windows.
  const npmCmd = Deno.build.os === "windows" ? "npm.cmd" : "npm";

  // Wir starten 'npm run build' im Projektordner des Nutzers
  const command = new Deno.Command(npmCmd, {
    args   : ["run", "build"],
    cwd    : projectRoot,
    stdout : "inherit", // Zeigt den Output des Bundlers direkt in der Konsole an
    stderr : "inherit"
  });

  const { success, code } = await command.output();
  success ? console.log("[Bundler:Frontend] Frontend erfolgreich gebaut.")
          : throw new Error(`Frontend-Build fehlgeschlagen mit Exit-Code ${code}.`);
  
}
