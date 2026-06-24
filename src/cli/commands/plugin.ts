import { plugins } from "../core/config.ts";
import { log }     from "../core/logger.ts";

export default async function plugin([action, name]: string[]) {
  if (action === "list") {
    console.log(Object.keys(plugins).join("\n"));
    return;
  }

  if (action === "add") {
    if (!plugins[name]) {
      log.error(`Unknown plugin: ${name}`);
      return;
    }
    console.log(`Installing plugin: ${name}`);
  }
}
