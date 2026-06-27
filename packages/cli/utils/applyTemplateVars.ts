// @skullface/cli/utils/applyTemplateVars.ts

import { DOCS_URL } from '@/utils';

export async function applyTemplateVars (
  vars : Record<string, string>, 
  dir  : string
) {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    
    // Recursion, Baby!
    if (entry.isDirectory) {
      await applyTemplateVars(vars, path);
      continue;
    }
    
    // Define Variables
    vars.docs = DOCS_URL;
    
    // Transform
    let text = await Deno.readTextFile(path);
    for (const [key, value] of Object.entries(vars)) {
      text = text.replaceAll(`{{${key}}}`, value);
    }
    
    // Save File
    await Deno.writeTextFile(path, text);
  }
}
