// packages/cli/registry.ts

import build    from "./commands/build.ts";
import create   from "./commands/create.ts";
import dev      from "./commands/dev.ts";
import doctor   from "./commands/doctor.ts";
import plugin   from "./commands/plugin.ts";
import template from "./commands/template.ts";

let REPO_URL = 'https://github.com/pulgasari/skullface';

export const commands = {
  build,
  create,
  dev,
  doctor,
  plugin,
  template,
};

export const plugins = [
  "clipboard",
  "dialogs",
  "external",
  "fs",
  "hotkeys",
  "logger",
  "notifications",
  "router",
  "sqlite",
  "store",
];

export const templates = [
  'datastar',
  'htmx',
  'preact',
  'react',
  'svelte',
  'vanilla',
  'vanilla-ts'
];

export default { commands, plugins, templates };
