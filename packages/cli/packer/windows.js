// @skullface/cli/packer/windows.js

import Wizard from '@/wizard';
const wizard = new Wizard ({ prefix: '[Packer:Windows]' });

export default class {
  async pack ({ binaryPath, projectRoot, appName, appSlug, options }) {
    wizard.print('Bereite Windows Release-Ordner vor ...');
    
    const outputDir        = `${projectRoot}/dist-native/windows`;
    const targetBinaryPath = `${outputDir}/${appName}.exe`;
    
    await Deno.mkdir(outputDir, { recursive: true }); // Create Output Directory
    await Deno.rename(binaryPath, targetBinaryPath); // Move .exe-File

    wizard.print(`Windows-App moved to: ${targetBinaryPath}`);
  }
}
