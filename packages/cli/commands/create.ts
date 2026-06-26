// packages/cli/commands/create.ts

import registry from './../registry.js';
import wizard   from './../wizard.ts';
import { applyVariables, copyTemplate, enablePlugins } from './../utils.js';

export default async function createCommand () {
  wizard.print("Skullface Create Wizard");

  const slug      =  await wizard.ask("App ID / Slug:");
  const name      = (await wizard.ask("App Name (Enter = same as slug):")) || slug;
  const framework = (await wizard.select("Choose frontend:", registry.templates)) || 'vanilla';
  const plugins   =  await wizard.multiselect("Select plugins:", registry.plugins);
  const targetDir = `./${slug}`;

  wizard.print("Creating project:", targetDir);

  await copyTemplate({ name: framework, dir: targetDir });
  await applyVariables({ slug, name }, targetDir);
  await enablePlugins(plugins, targetDir);

  wizard.print("Done!");
  wizard.print(`cd ${slug}`);
  wizard.print("skullface dev");
}
