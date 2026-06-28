#!/usr/bin/env -S deno run -A
// @skullface/cli/mod.ts

import { COMMANDS }  from '@/types';
import { parseArgs } from '@std/cli/parse-args';
import  buildCommand from './commands/build.ts';
import createCommand from './commands/create.ts';
import    devCommand from './commands/dev.ts';
import   helpCommand from './commands/help.ts';
import pluginCommand from './commands/plugin.ts';

// Flags parsen (z. B. --target linux oder -t linux)
const flags = parseArgs(Deno.args, {
  string : ["target"],
  alias  : { target: "t" },
});

const cmd     = flags._[0];
const subArgs = flags._.slice(1).map(String); // captures everything after 'plugin'

     if (cmd ===  'build') await  buildCommand({ target: flags.target });
else if (cmd === 'create') await createCommand();
else if (cmd ===    'dev') await    devCommand();
else if (cmd ===   'help') await   helpCommand();
else if (cmd === 'plugin') await pluginCommand(subArgs);
else                       await   helpCommand();
