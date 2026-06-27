// @aufbau/cli/commands/help.ts

import { commands } from '@/types';

export default function helpCommand () {
  console.log("💀 Skullface CLI");
  console.log("\nVerfügbare Befehle:");
  console.log("  create   -> Erstellt ein neues Skullface Projekt via Wizard");
  console.log("  build    -> Kompiliert das Projekt basierend auf der Config");
  console.log("\nOptionen für 'build':");
  console.log("  -t, --target <platform>  -> Erzwingt den Build für eine bestimmte Plattform (mac, windows, linux)");
}
