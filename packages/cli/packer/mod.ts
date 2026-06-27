// @skullface/cli/src/packer/mod.ts

import { Platform } from '@/types';
import     { MacPacker } from   "./macos.ts";
import { WindowsPacker } from "./windows.ts";
import   { LinuxPacker } from   "./linux.ts";

export interface Packer {
  pack (binaryPath: string, projectRoot: string) : Promise<void>;
}

export function getPacker (target: Platform): Packer {
  switch (target) {
    case 'linux'   : return new   LinuxPacker();
    case 'mac'     : return new     MacPacker();
    case 'windows' : return new WindowsPacker();
    default        : throw new Error(`Unsupported packaging platform: ${target}`);
  }
}
