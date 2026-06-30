// @skullface/cli/packer/index.js

import AndroidPacker from './android.js';
import FreeBSDPacker from './freebsd.js';
import   LinuxPacker from   './linux.js';
import     MacPacker from     './mac.js';
import WindowsPacker from './windows.js';

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
