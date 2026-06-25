// packages/cli/commands/create.ts

import { plugins, templates } from './../registry.js';
import {
  ask, multiselect, select,
  copyTemplate,
  applyVariables, enablePlugins
} from './../utils.js';

let   pluginKeys = Object.keys(plugins);
let templateKeys = Object.keys(templates);

export default async function createCommand () {
  console.log("Skullface Create Wizard\n");

  const slug      = await ask("App ID / Slug:");
  const name      = (await ask("App Name (Enter = same as slug):")) || slug;
  const framework = (await select("Choose frontend:", templateKeys)) || 'vanilla';
  const plugins   = await multiselect("Select plugins:", pluginKeys);
  const targetDir = `./${slug}`;

  console.log("\nCreating project:", targetDir);

  await copyTemplate(framework, targetDir);
  await applyVariables({ slug, name }, targetDir);
  await enablePlugins(plugins, targetDir);

  console.log("\nDone!");
  console.log(`cd ${slug}`);
  console.log("skullface dev");
                      }
