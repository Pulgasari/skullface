// packages/cli/utils.ts

import { templates } from './registry.js';
import wizard        from './wizard.ts';
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import { join } from "https://deno.land/std@0.224.0/path/mod.ts";


// Constants

export const DEFAULT_TEMPLATE   = 'vanilla';
export const REPO_ZIP_URL       = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;
export const TEMPLATE_PATH_PART = `skullface-main/templates/vanilla/`;

// Plugins

export async function enablePlugins (plugins: string[], dir: string) {
  const configPath = `${dir}/skullface.json`;

  let config = {};
  try {
    config = JSON.parse(await Deno.readTextFile(configPath));
  } catch {
    config = {};
  }

  config.plugins = plugins;

  await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));
}

// Templates

export async function copyTemplate ({
  dir  : string,
  name : string = "vanilla-ts"
}) {
  let targetDir = dir;
  try {
    const repoZipUrl = REPO_ZIP_URL;
    wizard.print("Download Template ...");
    const response = await fetch(repoZipUrl);
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

export async function copyTemplateOld (
  name      : string, 
  targetDir : string
) {
  const sourceDir = templates[name];
  await Deno.mkdir(targetDir, { recursive: true });

  for await (const entry of Deno.readDir(sourceDir)) {
    const from = `${sourceDir}/${entry.name}`;
    const to   = `${targetDir}/${entry.name}`;

    entry.isDirectory
    ? await copyTemplate(`${name}/${entry.name}`, to)
    : await Deno.copyFile(from, to);
  }
}

export async function applyVariables (
  vars : Record<string, string>, 
  dir  : string
) {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    
    // Recursion, Baby!
    if (entry.isDirectory) {
      await applyVariables(vars, path);
      continue;
    }
    
    // Define Variables
    vars.docs = 'https://github.com/pulgasari/skullface/docs';
    
    // Transform
    let text = await Deno.readTextFile(path);
    for (const [key, value] of Object.entries(vars)) {
      text = text.replaceAll(`{{${key}}}`, value);
    }
    
    // Save File
    await Deno.writeTextFile(path, text);
  }
}






