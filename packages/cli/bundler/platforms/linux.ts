export async function packLinux (ctx) {
  const src = `dist/bundle/linux/SkullfaceApp`;
  const out = `dist/release/${ctx.config.name}-linux.tar.gz`;

  const p = new Deno.Command("tar", {
    args: ["-czf", out, "."],
    cwd: src,
  }).spawn();

  await p.status;
}
