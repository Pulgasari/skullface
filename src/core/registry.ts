import build    from "../commands/build.ts";
import create   from "../commands/create.ts";
import dev      from "../commands/dev.ts";
import doctor   from "../commands/doctor.ts";
import plugin   from "../commands/plugin.ts";
import template from "../commands/template.ts";

export const commandRegistry = {
  create,
  dev,
  build,
  plugin,
  template,
  doctor,
};
