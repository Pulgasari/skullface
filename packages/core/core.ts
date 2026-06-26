// core.ts

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

export async function getProjectPaths (dir: string) {
  dir ??= Deno.cwd(); 
  const backend  = join(dir, "src-backend");
  const frontend = join(dir, "src-frontend");
  
  return { 
    backend, 
    frontend,
  };
}

export async function loadConfig (dir: string) {
  dir ??= Deno.cwd();
  const configPath = `${dir}/skullface.config.js`;
  
  try       { await Deno.stat(configPath); }
  catch (e) { console.error('SkullfaceConfig missing.'); }
  
  const mod = await import(configPath);
  //const mod = await import(`file://${configPath}`)
  return mod.default;
}

export const log = {
  info  : (message: string) => console.log(`ℹ️ ${message}`),
  warn  : (message: string) => console.log(`⚠️ ${message}`),
  error : (message: string) => console.log(`❌ ${message}`),
};

export async function loadPlugins (pluginNames: string[]) {
  const plugins = [];

  for (const name of pluginNames) {
    const mod = await import(`../../plugins/${name}/mod.ts`);
    plugins.push(mod.default);
  }

  return {
    list: plugins,
    async runHook(hook, ctx) {
      for (const p of plugins) {
        if (p.hooks?.[hook]) {
          await p.hooks[hook](ctx);
        }
      }
    },
  };
}
