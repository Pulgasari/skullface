// @skullface/cli/utils/copyTemplate.ts

import { REPO_ZIP_URL } from '@/utils';
import wizard from '@/wizard'

export async function copyTemplate ({
  dir  : string,
  name : string = "vanilla-ts"
}) {
  let targetDir = dir;
  try {
    wizard.print("Download Template ...");
    const response = await fetch(REPO_ZIP_URL);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
    
    const expectedPathPart = `skullface-main/templates/${name}/`;
    const zipData   = await response.arrayBuffer();
    const zip       = new JSZip();
    const loadedZip = await zip.loadAsync(zipData);
    
    await Deno.mkdir(targetDir, { recursive: true });

    wizard.print("Unzip Project Files ...);
  
    for (const [filename, fileObj] of Object.entries(loadedZip.files)) {
      if (filename.includes(expectedPathPart) && !fileObj.dir) {
          
        // "skullface-main/templates/vanilla-ts/src-frontend/index.html" 
        // -> "src-frontend/index.html"
        const relativePath   = filename.replace(expectedPathPart, '');
        const fullOutputPath = join(targetDir, relativePath);
  
        // Ensure Directory Structure
        const fileDir = join(fullOutputPath, "..");
        await Deno.mkdir(fileDir, { recursive: true });
          
        // Read and Write File as Uint8Array (Bytes)
        const content = await fileObj.async("uint8array");
        await Deno.writeFile(fullOutputPath, content);
          
        wizard.print(`   + ${relativePath}`);
      }
    }

    wizard.print(`Done!`);
  } 
  catch (error) {
    console.error("Error on Create:", error.message);
  }
}
