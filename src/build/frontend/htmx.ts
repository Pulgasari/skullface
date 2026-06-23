export async function buildHTMX (ctx) {
  await Deno.mkdir(ctx.paths.frontend, { recursive: true });

  for await (const entry of Deno.readDir("frontend")) {
    await Deno.copyFile(
      `frontend/${entry.name}`,
      `${ctx.paths.frontend}/${entry.name}`,
    );
  }
}
