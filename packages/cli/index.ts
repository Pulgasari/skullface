#!/usr/bin/env -S deno run -A
// @skullface/cli/mod.ts

import { parseArgs } from "@std/cli/parse-args";
import { buildCommand } from "./commands/build.ts";
import createCommand from "./commands/create.ts";
import   helpCommand from "./commands/help.ts";
import { commands } from '@/types';

// Flags parsen (z. B. --target linux oder -t linux)
const flags = parseArgs(Deno.args, {
  string : ["target"],
  alias  : { target: "t" },
});

const cmd = flags._[0];

     if (cmd === 'build')  await  buildCommand({ target: flags.target });
else if (cmd === 'create') await createCommand();
else                       await   helpCommand();
