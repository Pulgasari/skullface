// @skullface/cli/bundler/index.js

import compileBackend from './backend.ts';
import buildFrontend  from './frontend.ts';
import getPacker      from '@/packer';

import Wizard from '@/wizard';
const wizard = new Wizard ({ prefix: '[Bundler]' });

export class SkullfaceBundler {
  constructor (config) {
    this.config = config;
  }

  // Main Process of the Build-Pipeline
  async build () {
    const { platform, appName, appSlug, projectRoot, targetOptions } = this.config;
    
    await buildFrontend(projectRoot);

    // Wichtig: Da compileBackend mit SKULLFACE_ENV=production läuft, liest
    // der Core-Prozess die frisch gebauten Frontend-Dateien aus /dist ein und bettet sie ein!
    const binaryPath = await compileBackend(platform, projectRoot);
    const packer     = getPacker(platform);
    await packer.pack({ binaryPath, projectRoot, appName, appSlug, options: targetOptions });

    //  clean up temp directories
    try { await Deno.remove(`${projectRoot}/.skullface-tmp`, { recursive: true }); }
    catch (_e) {} // Ignorieren, falls schon weg

    wizard.success(`Build-Vorgang für ${platform.toUpperCase()} vollständig abgeschlossen!`);
  }
}
