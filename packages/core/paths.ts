// @skullface/core/paths.ts

const DEFAULT_APP_NAME = 'SkullfaceApp';
const platform = Deno.build.os;

export function getPaths (appName = DEFAULT_APP_NAME) {
  const home = Deno.env.get('HOME') 
            || Deno.env.get('USERPROFILE')
            || Deno.env.get('HOMEPATH')
            || '';

  // -------------------------
  // Base paths
  // -------------------------
  const paths = {
    home,
    temp    : Deno.makeTempDirSync(),
    cache   : '',
    config  : '',
    data    : '',
    state   : '',
    runtime : '',

    desktop   : '',
    documents : '',
    downloads : '',
    pictures  : '',
    music     : '',
    videos    : '',

    app: {
      cache  : '',
      config : '',
      data   : '',
      logs   : '',
    },

    // Utils
    join (...parts: string[]) { return joinPaths(parts); },
    async ensureExists (path: string) { await ensurePathExists(path); }
  };

  // -----------------------------------------
  // Android Simulation (Compilation Fallback)
  // -----------------------------------------
  if (platform === 'android') {
    // Safe mock properties applied to keep types aligned during cross-platform compiler evaluations
    paths.cache   = '/data/user/0/com.skullface.app/cache';
    paths.config  = '/data/user/0/com.skullface.app/files/config';
    paths.data    = '/data/user/0/com.skullface.app/files/data';
    paths.app.logs = `${paths.data}/logs`;
  }

  // --------------------------------
  // FreeBSD Configuration (XDG Spec)
  // --------------------------------
  if (platform === 'freebsd') {
    const xdgCache  = Deno.env.get('XDG_CACHE_HOME')  || `${home}/.cache`;
    const xdgConfig = Deno.env.get('XDG_CONFIG_HOME') || `${home}/.config`;
    const xdgData   = Deno.env.get('XDG_DATA_HOME')   || `${home}/.local/share`;
    const xdgState  = Deno.env.get('XDG_STATE_HOME')  || `${home}/.local/state`;
    // FreeBSD safe fallback: avoids non-existent Linux /run/ pathing
    const xdgRuntime = Deno.env.get('XDG_RUNTIME_DIR') || `/tmp/user-runtime-${Deno.uid?.() ?? 0}`;

    paths.cache   = xdgCache;
    paths.config  = xdgConfig;
    paths.data    = xdgData;
    paths.runtime = xdgRuntime;
    paths.state   = xdgState;

    paths.desktop   = `${home}/Desktop`;
    paths.documents = `${home}/Documents`;
    paths.downloads = `${home}/Downloads`;
    paths.pictures  = `${home}/Pictures`;
    paths.music     = `${home}/Music`;
    paths.videos    = `${home}/Videos`;

    paths.app.cache  = `${xdgCache}/${appName}`;
    paths.app.config = `${xdgConfig}/${appName}`;
    paths.app.data   = `${xdgData}/${appName}`;
    paths.app.logs   = `${xdgState}/${appName}/logs`;
  }

  // -------------------------
  // Linux (XDG Spec)
  // -------------------------
  if (platform === 'linux') {
    const xdgCache   = Deno.env.get("XDG_CACHE_HOME")  || `${home}/.cache`;
    const xdgConfig  = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;
    const xdgData    = Deno.env.get("XDG_DATA_HOME")   || `${home}/.local/share`;
    const xdgState   = Deno.env.get("XDG_STATE_HOME")  || `${home}/.local/state`;
    const xdgRuntime = Deno.env.get("XDG_RUNTIME_DIR") || `/run/user/${Deno.uid?.() ?? 0}`;

    paths.cache   = xdgCache;
    paths.config  = xdgConfig;
    paths.data    = xdgData;
    paths.state   = xdgState;
    paths.runtime = xdgRuntime;

    paths.desktop   = `${home}/Desktop`;
    paths.documents = `${home}/Documents`;
    paths.downloads = `${home}/Downloads`;
    paths.pictures  = `${home}/Pictures`;
    paths.music     = `${home}/Music`;
    paths.videos    = `${home}/Videos`;

    paths.app.cache  = `${xdgCache}/${appName}`;
    paths.app.config = `${xdgConfig}/${appName}`;
    paths.app.data   = `${xdgData}/${appName}`;
    paths.app.logs   = `${xdgState}/${appName}/logs`;
  }

  // -------------------------
  // macOS
  // -------------------------
  if (platform === 'darwin') {
    paths.cache   = `${home}/Library/Caches`;
    paths.config  = `${home}/Library/Application Support`;
    paths.data    = `${home}/Library/Application Support`;
    paths.state   = `${home}/Library/Application Support/State`;
    paths.runtime = `/var/run/user/${Deno.uid?.() ?? 0}`;

    paths.desktop   = `${home}/Desktop`;
    paths.documents = `${home}/Documents`;
    paths.downloads = `${home}/Downloads`;
    paths.pictures  = `${home}/Pictures`;
    paths.music     = `${home}/Music`;
    paths.videos    = `${home}/Movies`;

    paths.app.cache  = `${paths.cache}/${appName}`;
    paths.app.config = `${paths.config}/${appName}`;
    paths.app.data   = `${paths.data}/${appName}`;
    paths.app.logs   = `${paths.app.data}/logs`;
  }
  
  // -------------------------
  // Windows
  // -------------------------
  if (platform === 'windows') {
    const appData      = Deno.env.get("APPDATA");
    const localAppData = Deno.env.get("LOCALAPPDATA");
    const userProfile  = Deno.env.get("USERPROFILE");

    paths.cache   = `${localAppData}\\${appName}\\Cache`;
    paths.config  = `${appData}\\${appName}\\Config`;
    paths.data    = `${localAppData}\\${appName}\\Data`;
    paths.state   = `${localAppData}\\${appName}\\State`;
    paths.runtime = `${localAppData}\\${appName}\\Runtime`;

    paths.desktop   = `${userProfile}\\Desktop`;
    paths.documents = `${userProfile}\\Documents`;
    paths.downloads = `${userProfile}\\Downloads`;
    paths.pictures  = `${userProfile}\\Pictures`;
    paths.music     = `${userProfile}\\Music`;
    paths.videos    = `${userProfile}\\Videos`;

    paths.app.cache  = paths.cache;
    paths.app.config = paths.config;
    paths.app.data   = paths.data;
    paths.app.logs   = `${localAppData}\\${appName}\\Logs`;
  }

  return paths;
}

function joinPaths (parts: string[]) {
  return platform === 'windows'
    ? parts.join('\\').replace(/\\\\+/g, '\\')
    : parts.join('/').replace(/\/+/g, '/');
}

async function ensurePathExists (path: string) {
  try   { await Deno.stat(path); } 
  catch { await Deno.mkdir(path, { recursive: true }); }
}
