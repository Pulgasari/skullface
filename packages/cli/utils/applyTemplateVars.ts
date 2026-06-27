// @skullface/cli/utils/applyTemplateVars.ts

import { DOCS_URL } from '@/utils';

export async function applyTemplateVars (
  vars : Record<string, string>, 
  dir  : string
) {
  // Always inject global framework variables
  vars.docs = DOCS_URL;

  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    
    // Recursively step into nested directories
    if (entry.isDirectory) {
      await applyTemplateVars(vars, path);
      continue;
    }
    
    // Process text files and skip binary objects safely
    try {
      let text = await Deno.readTextFile(path);
      
      for (const [key, value] of Object.entries(vars)) {
        text = text.replaceAll(`{{${key}}}`, value);
      }
      
      await Deno.writeTextFile(path, text);
    }
    catch (_error) {} // Fail silently if the file is binary (e.g., images, icons)
  }
}
