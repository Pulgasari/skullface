export default async function dev() {
  console.log("🚀 Starting Skullface Dev Server...");
  const p = Deno.run({
    cmd: ["deno", "task", "dev"],
  });
  await p.status();
}
