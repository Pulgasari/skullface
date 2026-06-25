export async function packWindows (ctx) {
  const src = `dist/bundle/windows/SkullfaceApp`;
  const out = `dist/release/${ctx.config.name}-windows.zip`;

  const p = new Deno.Command("zip", {
    args: ["-r", out, "."],
    cwd: src,
  }).spawn();

  await p.status;
}
