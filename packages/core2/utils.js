// @skullface/core/utils.js

// :::::: CHECKS (IS)

export const isFn = sth => typeof sth === 'function';

// :::::: RUNTIME

export function getPlatform () {
  const name = Deno.build.os;
  return {
    android : 'android',
    darwin  : 'mac',
    freebsd : 'freebsd',
    linux   : 'linux',
    mac     : 'mac',
    macos   : 'mac',
    windows : 'windows',
  }[name];
}
