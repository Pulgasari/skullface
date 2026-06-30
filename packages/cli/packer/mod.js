// @skullface/cli/packer/mod.js

import AndroidPacker from './android.ts';
import FreeBSDPacker from './freebsd.ts';
import   LinuxPacker from   './linux.ts';
import     MacPacker from     './mac.ts';
import WindowsPacker from './windows.ts';

export default function (platform) {
  switch (platform) {
    case 'android' : return new AndroidPacker();
    case 'freebsd' : return new FreeBSDPacker();
    case 'linux'   : return new   LinuxPacker();
    case 'mac'     : return new     MacPacker();
    case 'windows' : return new WindowsPacker();
    default        : throw new Error(`Unsupported packaging platform: ${platform}`);
  }
}
