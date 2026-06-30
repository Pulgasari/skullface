// @skullface/cli/packer/freebsd.js

import Wizard from '@/wizard';
const wizard = new Wizard ({ prefix: '[Packer:FreeBSD]' });

export default class {
  async pack ({ binaryPath, projectRoot, appName, appSlug, options ) {
    wizard.print('Preparing FreeBSD release package...');

    const outputDir        = `${projectRoot}/dist-native/freebsd`;
    const stageDir         = `${outputDir}/stage`;
    const targetBinaryPath = `${stageDir}/${appSlug}`;

    // 1. Create clean output and temporary staging directories
    await Deno.mkdir(stageDir, { recursive: true });

    // 2. Move compiled binary into staging folder and enforce executable permissions (755)
    await Deno.rename(binaryPath, targetBinaryPath);
    await Deno.chmod(targetBinaryPath, 0o755);

    // 3. Compress staging directory contents into a native FreeBSD .txz archive
    wizard.print('Compressing into standalone .txz archive...');
    let archiveSuccess = false;
    
    try {
      const command = new Deno.Command('tar', {
        args   : ['-cJf', `${outputDir}/${appSlug}.txz`, '-C', stageDir, '.'],
        stdout : 'piped',
        stderr : 'piped'
      });

      const { success, stderr } = await command.output();
      if (success) {
        wizard.success(`FreeBSD .txz package successfully created!`);
        archiveSuccess = true;
      } else {
        const errorMsg = new TextDecoder().decode(stderr);
        wizard.warn('tar compression process failed:', errorMsg);
      }
    } catch (_e) {
      wizard.info('Native "tar" command line tool not found. Staging folder left intact.');
    }

    // 4. Perform post-build cleanup of the temporary staging workspace
    if (archiveSuccess) {
      try { await Deno.remove(stageDir, { recursive: true }); } 
      catch (_e) {} // Fail silently if temporary directory cleanup encounters a lock
    }
  }
}
