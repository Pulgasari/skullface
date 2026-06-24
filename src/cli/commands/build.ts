// cli/commands/build.ts

import { createContext } from "../core/context.ts";
import { prepare }       from "../build/prepare.ts";
import { buildFrontend } from "../build/frontend.ts";
import { buildBackend }  from "../build/backend.ts";
import { compile }       from "../build/compile.ts";
import { buildAppImage } from "../build/appimage.ts";
import { log }           from "../core/logger.ts";

export default async function build () {

  // AppImage
  if (args.includes("--target") && args.includes("appimage")) {
    await buildAppImage();
    Deno.exit(0);
  }

  //
  else {
    const ctx = await createContext();
  
    log.info("Preparing build...");
    await prepare(ctx);
  
    log.info("Building frontend...");
    await buildFrontend(ctx);
  
    log.info("Building backend...");
    await buildBackend(ctx);
  
    log.info("Compiling binaries...");
    await compile(ctx);
  
    log.info("Build finished.");
  }
}
