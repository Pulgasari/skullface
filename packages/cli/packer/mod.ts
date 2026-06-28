// @skullface/cli/packer/mod.ts

import  { Platform } from '@/types';
import AndroidPacker from './android.ts';
import FreeBSDPacker from './freebsd.ts';
import   LinuxPacker from   './linux.ts';
import     MacPacker from   './macos.ts';
import WindowsPacker from './windows.ts';

export interface Packer {
  pack (binaryPath: string, projectRoot: string) : Promise<void>;
}

export function getPacker (target: Platform): Packer {
  switch (target) {
    case 'android' : return new AndroidPacker();
    case 'freebsd' : return new FreeBSDPacker();
    case 'linux'   : return new   LinuxPacker();
    case 'mac'     : return new     MacPacker();
    case 'windows' : return new WindowsPacker();
    default        : throw new Error(`Unsupported packaging platform: ${target}`);
  }
}
