// core.ts

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

export async function loadConfig () {
  const mod = await import(`${Deno.cwd()}/skullface.config.ts`);
  return mod.default;
}
