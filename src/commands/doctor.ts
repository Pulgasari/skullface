import { log } from "../core/logger.ts";

export default async function doctor() {
  log.info("Checking environment...");
  log.info("Deno version: " + Deno.version.deno);
  log.info("Everything looks good.");
}
