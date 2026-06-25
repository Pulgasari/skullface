export async function compile (ctx) {
  const targets = ctx.config.targets ?? ["x86_64-unknown-linux-gnu"];

  for (const target of targets) {
    const p = new Deno.Command("deno", {
      args: [
        "compile",
        "--target",
        target,
        "--output",
        `dist/bin/${target}/${ctx.config.name}`,
        "dist/backend/main.ts",
      ],
    }).spawn();
    await p.status;
  }
}
