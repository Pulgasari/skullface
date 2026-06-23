export async function buildBackend(ctx) {
  await Deno.mkdir(ctx.paths.backend, { recursive: true });

  await Deno.copyFile(
    ctx.config.entry,
    `${ctx.paths.backend}/main.ts`,
  );

  await ctx.plugins.runHook("onBuildBackend", ctx);
}
