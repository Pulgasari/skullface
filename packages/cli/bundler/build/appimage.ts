// build/appimage.ts

export async function buildAppImage() {
  console.log("Building AppImage...");

  const appDir = "dist/appimage/AppDir";

  await generateAppDir      (appDir);
  await generateAppRun      (appDir);
  await generateDesktopFile (appDir);
  await bundleDeno          (appDir);
  await squashToAppImage    (appDir);

  console.log("AppImage created in dist/");
}

export async function generateAppDir (appDir: string) {
  await Deno.mkdir(`${appDir}/usr/bin`,             { recursive: true });
  await Deno.mkdir(`${appDir}/usr/share/skullface`, { recursive: true });

  // Copy backend
  await copy("dist/backend", `${appDir}/usr/share/skullface/backend`);

  // Copy frontend
  await copy("dist/frontend", `${appDir}/usr/share/skullface/frontend`);

  // Copy plugins
  await copy("dist/plugins", `${appDir}/usr/share/skullface/plugins`);
}

export async function generateAppRun (appDir: string) {
  const script = `#!/bin/bash
HERE="$(dirname "$(readlink -f "$0")")"

export SKULLFACE_APPDIR="$HERE"
export SKULLFACE_DATA_DIR="$HOME/.local/share/skullface"
export SKULLFACE_CONFIG_DIR="$HOME/.config/skullface"

exec "$HERE/usr/bin/deno-desktop" \
  "$HERE/usr/bin/skullface-app" \
  "$@"
`;

  await Deno.writeTextFile(`${appDir}/AppRun`, script);
  await Deno.chmod(`${appDir}/AppRun`, 0o755);
}

export async function generateDesktopFile (appDir: string, name = "Skullface App") {
  const desktop = `[Desktop Entry]
Type=Application
Name=${name}
Exec=AppRun
Icon=skullface
Categories=Utility;
`;

  await Deno.writeTextFile(`${appDir}/skullface.desktop`, desktop);
}

export async function bundleDeno (appDir: string) {
  await Deno.copyFile(
    "/usr/bin/deno-desktop",
    `${appDir}/usr/bin/deno-desktop`
  );

  await Deno.copyFile(
    "dist/skullface-app",
    `${appDir}/usr/bin/skullface-app`
  );

  await Deno.chmod(`${appDir}/usr/bin/deno-desktop`,  0o755);
  await Deno.chmod(`${appDir}/usr/bin/skullface-app`, 0o755);
}

export async function squashToAppImage (appDir: string) {
  const output = "dist/Skullface.AppImage";
  const cmd    = new Deno.Command("mksquashfs", { args: [appDir, output, "-root-owned", "-noappend"] });

  await cmd.output();
}
