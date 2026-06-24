// core.ts

import { loadConfig } from "./loadConfig.ts";
import { loadPlugins } from "./plugins.ts";

export async function createContext () {
  const config = await loadConfig();

  const ctx = {
    config,
    root: Deno.cwd(),
    paths: {
      dist     : "dist",
      frontend : "dist/frontend",
      backend  : "dist/backend",
    },
    plugins: await loadPlugins(config.plugins),
  };

  return ctx;
}
