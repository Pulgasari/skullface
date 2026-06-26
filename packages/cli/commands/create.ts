// packages/cli/commands/create.ts

import wizard from './../wizard.ts';
import { plugins, templates } from './../registry.js';
import { applyVariables, copyTemplate, enablePlugins } from './../utils.js';

let   pluginKeys = Object.keys(plugins);
let templateKeys = Object.keys(templates);

export default async function createCommand () {
  wizard.print("Skullface Create Wizard");

  const slug      =  await wizard.ask("App ID / Slug:");
  const name      = (await wizard.ask("App Name (Enter = same as slug):")) || slug;
  const framework = (await wizard.select("Choose frontend:", templateKeys)) || 'vanilla';
  const plugins   =  await wizard.multiselect("Select plugins:", pluginKeys);
  const targetDir = `./${slug}`;

  wizard.print("Creating project:", targetDir);

  await copyTemplate({ name: framework, dir: targetDir });
  await applyVariables({ slug, name }, targetDir);
  await enablePlugins(plugins, targetDir);

  wizard.print("Done!");
  wizard.print(`cd ${slug}`);
  wizard.print("skullface dev");
}
