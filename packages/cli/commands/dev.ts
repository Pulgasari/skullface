// packages/cli/commands/dev.ts

export default async function dev() {
  console.log("Start Skullface Dev Server...");
  const p = Deno.run({ cmd: ["deno", "task", "dev"] });
  await p.status();
}
