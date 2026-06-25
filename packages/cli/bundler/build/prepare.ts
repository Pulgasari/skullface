export async function prepare (ctx) {
  await Deno.remove("dist", { recursive: true }).catch(() => {});
  await Deno.mkdir("dist", { recursive: true });

  await ctx.plugins.runHook("onBuildStart", ctx);
}
