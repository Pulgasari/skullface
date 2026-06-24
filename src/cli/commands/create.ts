// cli/commands/create.ts

import { ask } from "../utils/ask.ts";
import { select } from "../utils/select.ts";
import { multiselect } from "../utils/multiselect.ts";
import { TEMPLATE_REGISTRY } from "../utils/templates.ts";
import { copyTemplate } from "../utils/copy.ts";
import { applyVariables } from "../utils/variables.ts";
import { enablePlugins } from "../utils/plugins.ts";

export async function createCommand() {
  console.log("Skullface Create Wizard\n");

  const slug = await ask("App ID / Slug:");
  const name = (await ask("App Name (Enter = same as slug):")) || slug;

  const framework = await select("Choose frontend:", [
    "vanilla",
    "preact",
    "react",
    "svelte",
    "htmx",
    "datastar"
  ]);

  const plugins = await multiselect("Select plugins:", [
    "fs",
    "store",
    "sqlite",
    "logger",
    "router",
    "hotkeys",
    "notifications",
    "dialogs",
    "launch"
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
