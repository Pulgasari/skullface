// src/core/paths.ts

export function getPaths () {
  const home = Deno.env.get("HOME")
            || Deno.env.get("USERPROFILE")
            || Deno.env.get("HOMEPATH");

  const platform = Deno.build.os;

  const paths = {
    home,
    temp   : Deno.makeTempDirSync(),
    cache  : "",
    config : "",
    data   : "",
  };

  if (platform === "darwin") {
    paths.cache  = `${home}/Library/Caches/Skullface`;
    paths.config = `${home}/Library/Application Support/Skullface`;
    paths.data   = `${home}/Library/Application Support/Skullface`;
  }

  if (platform === "linux") {
    const xdgCache  = Deno.env.get("XDG_CACHE_HOME") || `${home}/.cache`;
    const xdgConfig = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;
    const xdgData   = Deno.env.get("XDG_DATA_HOME") || `${home}/.local/share`;

    paths.cache  = `${xdgCache}/skullface`;
    paths.config = `${xdgConfig}/skullface`;
    paths.data   = `${xdgData}/skullface`;
  }

  if (platform === "windows") {
    const appData      = Deno.env.get("APPDATA");
    const localAppData = Deno.env.get("LOCALAPPDATA");

    paths.cache  = `${localAppData}\\Skullface\\Cache`;
    paths.config = `${appData}\\Skullface\\Config`;
    paths.data   = `${localAppData}\\Skullface\\Data`;
  }

  return paths;
}
