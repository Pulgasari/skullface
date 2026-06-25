// packages/cli/commands/plugin.ts

import { plugins } from "./../registry.ts";
const pluginKeys = Object.keys(plugins);

export default async function plugin ([action, name]: string[]) {
  if (action === "list") {
    console.log(pluginKeys.join("\n"));
    return;
  }

  if (action === "add") {
    if (!plugins[name]) {
      console.error(`Unknown plugin: ${name}`);
      return;
    }
    console.log(`Installing plugin: ${name}`);
  }
}
