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
