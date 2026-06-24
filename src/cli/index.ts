#!/usr/bin/env -S deno run -A

import { createCommand } from "./commands/create.ts";

const args = Deno.args;

if (args[0] === "create") {
  await createCommand();
} else {
  console.log("Skullface CLI");
  console.log("Commands:");
  console.log("  create   Create a new Skullface project");
}
