// @skullface/cli/bundler/index.js

import { compileBackend } from './backend.ts';
import { buildFrontend }  from './frontend.ts';
import { getPacker }      from '@/packer';

export class SkullfaceBundler {
  constructor (private config: BundlerConfig) {}

  /**
   * Der Hauptprozess der Build-Pipeline
   */
  async build (): Promise<void> {
    const { platform, appName, appSlug, projectRoot, targetOptions } = this.config;

    // Schritt 1: Frontend aufräumen und neu bauen (erzeugt z.B. den /dist Ordner)
    await buildFrontend(projectRoot);

    // Schritt 2: Deno Compile antriggern. 
    // Wichtig: Da compileBackend mit SKULLFACE_ENV=production läuft, liest
    // der Core-Prozess die frisch gebauten Frontend-Dateien aus /dist ein und bettet sie ein!
    const rawBinaryPath = await compileBackend(platform, projectRoot);

    // Schritt 3: Den passenden Packer (Windows, Mac oder Linux) anfordern
    const packer = getPacker(platform);

    // Schritt 4: Die nackte Binärdatei in das plattformspezifische Format gießen
    await packer.pack(rawBinaryPath, projectRoot, {
      name: appName,
      slug: appSlug,
      options: targetOptions
    });

    // Schritt 5: Temporären Ordner aufräumen
    try { await Deno.remove(`${projectRoot}/.skullface-tmp`, { recursive: true }); }
    catch (_e) {} // Ignorieren, falls schon weg

    console.log(`[Bundler] Build-Vorgang für ${platform.toUpperCase()} vollständig abgeschlossen!`);
  }
  }
