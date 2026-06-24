#!/usr/bin/env -S deno run -A

import  buildCommand from "./commands/build.ts";
import createCommand from "./commands/create.ts";

const args = Deno.args;
const cmd  = args[0];

if (cmd === 'build')  await buildCommand();
if (cmd === 'create') await createCommand();

// if no legal command name is provided
// list all legal commands
if (!cmd) {
  console.log("Skullface CLI");
  console.log("Commands:");
  console.log("  build    -> ...")
  console.log("  create   -> Create a new Skullface project");
}

/*
import { parseArgs } from "@std/cli";
import { runCommand } from "./core/runner.ts";

const { _: raw, ...flags } = parseArgs(Deno.args);
const [command, ...args] = raw;
await runCommand(command, args, flags);
*/
