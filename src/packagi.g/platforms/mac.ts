export async function packMac (ctx) {
  const app = `dist/release/${ctx.config.name}.app`;

  await Deno.mkdir(`${app}/Contents/MacOS`, { recursive: true });
  await Deno.mkdir(`${app}/Contents/Resources`, { recursive: true });

  await Deno.copyFile(
    "dist/bundle/macos/SkullfaceApp",
    `${app}/Contents/MacOS/${ctx.config.name}`,
  );
}
