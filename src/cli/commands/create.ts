// cli/commands/create.ts

import {
  ask, multiselect, select,
  TEMPLATE_REGISTRY, copyTemplate,
  applyVariables, enablePlugins
} from './../utils.js';

export async function createCommand () {
  console.log("Skullface Create Wizard\n");

  const slug = await ask("App ID / Slug:");
  const name = (await ask("App Name (Enter = same as slug):")) || slug;

  const framework = await select("Choose frontend:", [
    "datastar",
    "htmx",
    "preact",
    "react",
    "svelte",
    "vanilla"
  ]);

  const plugins = await multiselect("Select plugins:", [
    "dialogs",
    "fs",
    "hotkeys",
    "launch",
    "logger",
    "notifications",
    "router",
    "sqlite",
    "store",
  ]);

  const targetDir = `./${slug}`;

  console.log("\nCreating project:", targetDir);

  await copyTemplate(framework, targetDir);
  await applyVariables({ slug, name }, targetDir);
  await enablePlugins(plugins, targetDir);

  console.log("\nDone!");
  console.log(`cd ${slug}`);
  console.log("skullface dev");
}
