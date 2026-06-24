// registry.ts

import build    from "./cli/commands/build.ts";
import create   from "./cli/commands/create.ts";
import dev      from "./cli/commands/dev.ts";
import doctor   from "./cli/commands/doctor.ts";
import plugin   from "./cli/commands/plugin.ts";
import template from "./cli/commands/template.ts";

export const commandRegistry = {
  create,
  dev,
  build,
  plugin,
  template,
  doctor,
};
