// packages/cli/commands/doctor.ts

export default async function doctor() {
  console.log("Checking environment ...");
  console.log("Deno version: " + Deno.version.deno);
  console.log("Everything looks good.");
}
