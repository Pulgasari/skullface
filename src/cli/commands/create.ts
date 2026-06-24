import { templates } from "../core/config.ts";
import { log }       from "../core/logger.ts";

export default async function create([name]: string[]) {
  if (!name) {
    log.error("Missing project name.");
    return;
  }

  const template = templates["preact"];
  await Deno.mkdir(name, { recursive: true });

  await Deno.copyFile(`${template}/project.json`, `${name}/project.json`);
  log.info(`Created new Skullface project: ${name}`);
}
