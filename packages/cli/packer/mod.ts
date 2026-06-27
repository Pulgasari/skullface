// @skullface/cli/src/packer/mod.ts

import     { MacPacker } from   "./macos.ts";
import { WindowsPacker } from "./windows.ts";
import   { LinuxPacker } from   "./linux.ts";

export interface Packer {
  pack (binaryPath: string, projectRoot: string) : Promise<void>;
}

export function getPacker (target: "mac" | "windows" | "linux"): Packer {
  switch (target) {
    case "mac"     : return new     MacPacker();
    case "windows" : return new WindowsPacker();
    case "linux"   : return new   LinuxPacker();
    default: throw new Error(`Unsupported packaging platform: ${target}`);
  }
}
