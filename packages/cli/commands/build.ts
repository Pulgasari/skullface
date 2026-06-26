// packages/cli/commands/build.ts

// Import: Deno
import { join } from '@std/path';

// Import: jsr:@skullface/core
import { createContext, loadConfig, log } from "@skullface/core";

// Import: jsr:@skullface/cli (self)
import { prepare }       from "./../build/prepare.ts";
import { buildFrontend } from "./../build/frontend.ts";
import { buildBackend }  from "./../build/backend.ts";
import { compile }       from "./../build/compile.ts";
import { buildAppImage } from "./../build/appimage.ts";

// Usage: skullface build
export default async function build () {
  
  // dynamic import
  const config      = await loadConfig();
  const appName     = config.app?.name     || "SkullfaceApp";
  const windowWidth = config.window?.width || 800;

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
