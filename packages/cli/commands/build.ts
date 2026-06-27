// @skullface/cli/commands/build.ts

import { loadConfig } from '@/utils';
import { SkullfaceBundler } from "./../bundler/mod.ts";

interface CliOptions {
  target?: string; // z.B. wenn der Nutzer --target linux eintippt
}

const DEFAULT_BUILD_TARGETS = ['linux'];

export async function buildCommand (options: CliOptions) {
  const config  = await loadConfig();
  const appName = config.app?.name || "SkullfaceApp";
  const appSlug = config.app?.slug || "skullfaceapp";

  // 3. Targets bestimmen (Normalisierung)
  let normalizedTargets: { platform: string; [key: string]: any }[] = [];

  // Case 1: CLI-Override (f.e. '--target linux')
  if (options.target) {
    normalizedTargets = [{ platform: options.target }];
  } 
  // Case 2: Read Targets from Skullface-Config-File (standard)
  else {
    const configTargets = config.build?.targets || DEFAULT_BUILD_TARGETS;
    normalizedTargets = configTargets.map(t => typeof t === "string" ? ({ platform: t }) : t);
  }

  // 4. Build-Schleife für alle ermittelten Targets starten
  console.log(`Starte Multi-Platform Build für: ${normalizedTargets.map(t => t.platform).join(", ")}`);

  for (const target of normalizedTargets) {
    console.log(`\n────────────────────────────────────────`);
    console.log(`🛠️  Kompiliere Target: ${target.platform.toUpperCase()}`);
    if (Object.keys(target).length > 1) {
      console.log(`⚙️  Zusatzoptionen:`, { ...target, platform: undefined });
    }
    console.log(`────────────────────────────────────────`);

    try {
      // Wir übergeben die dynamischen Daten an den Bundler
      const bundler = new SkullfaceBundler({
        appName, appSlug,
        platform      : target.platform as "mac" | "windows" | "linux",
        projectRoot   : Deno.cwd(),
        targetOptions : target // 'cfe: true'
      });

      await bundler.build();
      
      console.log(`Target ${target.platform.toUpperCase()} erfolgreich abgeschlossen.`);
    } catch (err: any) {
      console.error(`Fehler beim Kompilieren von ${target.platform.toUpperCase()}:`, err.message);
      // Optional: Prozesstopp bei Fehler, oder mit 'continue' zum nächsten Target springen
    }
  }

  console.log("Alle Builds erfolgreich beendet!");
}
