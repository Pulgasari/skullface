import { buildDatastar } from "./frontend/datastar.ts";
import { buildHTMX }     from "./frontend/htmx.ts";
import { buildPreact }   from "./frontend/preact.ts";


export async function buildFrontend (ctx) {
  switch (ctx.config.template) {
    case "datastar" : return buildDatastar(ctx);
    case "htmx"     : return buildHTMX(ctx);
    case "preact"   : return buildPreact(ctx);
    default         : throw new Error("Unknown template: " + ctx.config.template);
  }
}
