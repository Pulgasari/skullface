// @skullface/cli/packer/macos.ts

import wizard from '@/wizard';
import { Packer } from "./mod.ts";

export class MacPacker implements Packer {
  async pack (binaryPath: string, projectRoot: string): Promise<void> {
    console.log("[Packer:Mac] Erstelle macOS App-Bundle...");

    const appName       = "SkullfaceApp";
    const outputDir     = `${projectRoot}/dist-native/mac`;
    const appBundlePath = `${outputDir}/${appName}.app`;
    const contentsPath  = `${appBundlePath}/Contents`;
    const macosPath     = `${contentsPath}/MacOS`;
    const resourcesPath = `${contentsPath}/Resources`;

    // 1. Ordnerstruktur anlegen
    await Deno.mkdir(macosPath, { recursive: true });
    await Deno.mkdir(resourcesPath, { recursive: true });

    // 2. Move Binary-File into MacOS-Directory
    const targetBinaryPath = `${macosPath}/${appName.toLowerCase()}`;
    await Deno.rename(binaryPath, targetBinaryPath);

    // 3. Make Binary-File executable (755: rwxr-xr-x)
    await Deno.chmod(targetBinaryPath, 0o755);

    // 4. Generate Info.plist
    const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>English</string>
    <key>CFBundleExecutable</key>
    <string>${appName.toLowerCase()}</string>
    <key>CFBundleIdentifier</key>
    <string>com.skullface.${appName.toLowerCase()}</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>${appName}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>0.1.0</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>`;

    await Deno.writeTextFile(`${contentsPath}/Info.plist`, plistContent);

    // 5. (optional:) Copy Default-Icon
    const defaultIconSrc = `${projectRoot}/assets/icon.icns`;
    try {
      await Deno.copyFile(defaultIconSrc, `${resourcesPath}/icon.icns`);
      // Wenn das Icon existiert, müsste man es noch in der Info.plist eintragen
    } catch {
      console.log("[Packer:Mac] Kein Icon unter assets/icon.icns gefunden. Überspringe.");
    }

    console.log(`[Packer:Mac] .app Bundle erfolgreich erstellt unter: ${appBundlePath}`);
  }
}
