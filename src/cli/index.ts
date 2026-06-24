#!/usr/bin/env -S deno run -A

import  buildCommand from "./commands/build.ts";
import createCommand from "./commands/create.ts";

const args = Deno.args;
const cmd  = args[0];

if (!cmd) {
  console.log("Skullface CLI");
  console.log("Commands:");
  console.log("  create   -> Create a new Skullface project");
}

else {
  if (cmd === 'build')  await buildCommand();
  if (cmd === 'create') await createCommand();
}
