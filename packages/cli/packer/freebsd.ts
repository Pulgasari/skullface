// @skullface/cli/packer/freebsd.ts

import { Packer } from '@/packer';
import wizard     from '@/wizard';

export default class implements Packer {
  async pack (binaryPath: string, projectRoot: string, appMeta: { name: string; slug: string; options: any }): Promise<void> {
    console.log('[Packer:FreeBSD] Preparing FreeBSD release package...');

    const appName = appMeta.name;
    const outputDir = `${projectRoot}/dist-native/freebsd`;
    const stageDir = `${outputDir}/stage`;

    // 1. Create clean output and temporary staging directories
    await Deno.mkdir(stageDir, { recursive: true });

    // 2. Move compiled binary into staging folder and enforce executable permissions (755)
    const targetBinaryPath = `${stageDir}/${appName.toLowerCase()}`;
    await Deno.rename(binaryPath, targetBinaryPath);
    await Deno.chmod(targetBinaryPath, 0o755);

    // 3. Compress staging directory contents into a native FreeBSD .txz archive
    console.log('[Packer:FreeBSD] Compressing into standalone .txz archive...');
    let archiveSuccess = false;
    
    try {
      const command = new Deno.Command('tar', {
        args   : ['-cJf', `${outputDir}/${appName.toLowerCase()}.txz`, '-C', stageDir, '.'],
        stdout : 'piped',
        stderr : 'piped'
      });

      const { success, stderr } = await command.output();
      if (success) {
        console.log(`[Packer:FreeBSD] FreeBSD .txz package successfully created!`);
        archiveSuccess = true;
      } else {
        const errorMsg = new TextDecoder().decode(stderr);
        console.warn('[Packer:FreeBSD] tar compression process failed:', errorMsg);
      }
    } catch (_e) {
      console.info('[Packer:FreeBSD] Native "tar" command line tool not found. Staging folder left intact.');
    }

    // 4. Perform post-build cleanup of the temporary staging workspace
    if (archiveSuccess) {
      try { await Deno.remove(stageDir, { recursive: true }); } 
      catch (_e) {} // Fail silently if temporary directory cleanup encounters a lock
    }
  }
}
