// packages/cli/commands/init.ts

import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";

export async function initTemplate (
  projectName  : string, 
  templateName : string = "vanilla-ts"
) {
  const repoZipUrl = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;
    console.log("Download Template ...");
    const response = await fetch(repoZipUrl);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const expectedPathPart = `skullface-main/templates/${templateName}/`;
    const zipData   = await response.arrayBuffer();
    const zip       = new JSZip();
    const loadedZip = await zip.loadAsync(zipData);

    // Zielverzeichnis auf der Festplatte des Nutzers erstellen
    const targetDir = join(Deno.cwd(), projectName);
    await Deno.mkdir(targetDir, { recursive: true });

    console.log("Unzip Project Files ...);

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
        
        console.log(`   + ${relativePath}`);
      }
    }

    wizard.print(`Done!`);
  } 
  catch (error) {
    console.error("Error on Create:", error.message);
  }
}

export async function initProject (
  projectName  : string, 
  templateName : string = "vanilla-ts"
) {
  console.log(`Create Skullface Project: ${projectName}...`);

  const repoZipUrl = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;

  try {
    console.log("Download Template ...");
    const response = await fetch(repoZipUrl);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const expectedPathPart = `skullface-main/templates/${templateName}/`;
    const zipData   = await response.arrayBuffer();
    const zip       = new JSZip();
    const loadedZip = await zip.loadAsync(zipData);

    // Zielverzeichnis auf der Festplatte des Nutzers erstellen
    const targetDir = join(Deno.cwd(), projectName);
    await Deno.mkdir(targetDir, { recursive: true });

    console.log("Unzip Project Files ...);

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
        
        console.log(`   + ${relativePath}`);
      }
    }

    console.log(`\n Done! Project created in: ${targetDir}`);
    console.log(`\n  cd ${projectName}\n  skullface dev`);
  } 
  catch (error) {
    console.error("Error on Create:", error.message);
  }
}
