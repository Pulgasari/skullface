export async function buildPreact (ctx) {
  const p = new Deno.Command("deno", {
    args: ["task", "build:frontend"],
  }).spawn();

  await p.status;
}
