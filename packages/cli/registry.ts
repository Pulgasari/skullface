// packages/cli/registry.ts

import build    from "./commands/build.ts";
import create   from "./commands/create.ts";
import dev      from "./commands/dev.ts";
import doctor   from "./commands/doctor.ts";
import plugin   from "./commands/plugin.ts";
import template from "./commands/template.ts";

export const commands = {
  build,
  create,
  dev,
  doctor,
  plugin,
  template,
};

export const plugins = {
    "dialogs",
    "fs",
    "hotkeys",
    "launch",
    "logger",
    "notifications",
    "router",
    "sqlite",
    "store",
};

export const templates = {
  datastar : "templates/datastar",
  htmx     : "templates/htmx",
  preact   : "templates/preact",
  react    : "templates/react",
  svelte   : "templates/svelte",
  vanilla  : "templates/vanilla",
};

export default { commands, plugins, templates };
