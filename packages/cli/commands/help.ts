// @aufbau/cli/commands/help.ts

import { COMMANDS } from '@/types';
import wizard       from '@/wizard';

const buildCommandOptions : string[] = [
  '-t, --target <platform>  -> Erzwingt den Build für eine bestimmte Plattform (mac, windows, linux)',
];

export default function helpCommand () {
  wizard.print("💀 Skullface CLI");
  wizard.list(COMMANDS, { title: 'Commands:' });
  wizard.list(buildCommandOptions, { title: "Options for 'build':" });
}
