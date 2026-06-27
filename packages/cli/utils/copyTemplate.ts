// @skullface/cli/utils/copyTemplate.ts

import { JSZip } from 'https://deno.land/x/jszip@0.11.0/mod.ts';
import { join } from '@std/path';
import { REPO_ZIP_URL } from '@/utils';
import wizard from '@/wizard';

export async function copyTemplate ({
  dir,
  name = 'vanilla-ts'
}: {
  dir   : string;
  name? : string;
}) {
  const targetDir = dir;
  
  try {
    wizard.print('Download Template ...');
    const response = await fetch(REPO_ZIP_URL);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
    
    // Define the paths we want to capture from the repository structure
    const expectedFrameworkPart = `skullface-main/templates/${name}/`;
    const expectedConfigPath    = 'skullface-main/templates/skullface.config.js';

    const zip       = new JSZip();
    const zipData   = await response.arrayBuffer();
    const loadedZip = await zip.loadAsync(zipData);
    
    await Deno.mkdir(targetDir, { recursive: true });

    wizard.print('Unzip Project Files ...');
  
    for (const [filename, fileObj] of Object.entries(loadedZip.files)) {
      // Case 1: Extract the centralized config template file into the root directory
      if (filename === expectedConfigPath) {
        const fullOutputPath = join(targetDir, 'skullface.config.js');
        const content = await fileObj.async('uint8array');
        await Deno.writeFile(fullOutputPath, content);
        wizard.print('   + skullface.config.js');
        continue;
      }

      // Case 2: Extract specific framework frontend boilerplate files
      if (filename.includes(expectedFrameworkPart) && !fileObj.dir) {
        // e.g., "skullface-main/templates/vanilla-ts/src/main.ts" -> "src/main.ts"
        const relativePath   = filename.replace(expectedFrameworkPart, '');
        const fullOutputPath = join(targetDir, relativePath);
  
        // Ensure parent directory paths exist before writing file bytes
        const fileDir = join(fullOutputPath, '..');
        await Deno.mkdir(fileDir, { recursive: true });
          
        const content = await fileObj.async('uint8array');
        await Deno.writeFile(fullOutputPath, content);
          
        wizard.print(`   + ${relativePath}`);
      }
    }

    wizard.print('Done!');
  } 
  catch (error: any) {
    console.error('Error on Create:', error.message);
  }
}
