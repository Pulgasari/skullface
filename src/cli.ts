import { parseArgs } from "@std/cli";
import { printBranding } from "./core/branding.ts";
import { runCommand } from "./core/runner.ts";

const { _: raw, ...flags } = parseArgs(Deno.args);
const [command, ...args] = raw;

printBranding();
await runCommand(command, args, flags);
