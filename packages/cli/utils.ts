// packages/cli/utils.ts

import { templates } from './registry.js';

// Constants

export const DEFAULT_TEMPLATE   = 'vanilla';
export const REPO_ZIP_URL       = `https://github.com/pulgasari/skullface/archive/refs/heads/main.zip`;
export const TEMPLATE_PATH_PART = `skullface-main/templates/vanilla/`;

// Templates

export async function copyTemplate (name: string, targetDir: string) {
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

// Variables

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
