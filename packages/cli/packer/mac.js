// @skullface/cli/packer/mac.js

import wizard from '@/wizard';
//wizard.prefix = '[Packer:Mac]';

export default class {
  async pack ({ binaryPath, projectRoot, appName, appSlug, options }) {
    wizard.print('Create macOS App-Bundle ...');
    
    const outputDir        = `${projectRoot}/dist-native/mac`;
    const    appBundlePath = `${outputDir}/${appName}.app`;
    const     contentsPath = `${appBundlePath}/Contents`;
    const        macosPath = `${contentsPath}/MacOS`;
    const    resourcesPath = `${contentsPath}/Resources`;
    const targetBinaryPath = `${macosPath}/${appSlug}`;

    // 1. Create Directory Structure
    await Deno.mkdir(    macosPath, { recursive: true });
    await Deno.mkdir(resourcesPath, { recursive: true });

    // 2. Move Binary-File into MacOS-Directory
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
    <string>${appSlug}</string>
    <key>CFBundleIdentifier</key>
    <string>com.skullface.${appSlug}</string>
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
    // Wenn das Icon existiert, müsste man es noch in der Info.plist eintragen
    const iconSrc = `${projectRoot}/src-assets/icon.icns`;
    try   { await Deno.copyFile(iconSrc, `${resourcesPath}/icon.icns`); } 
    catch { wizard.print("Kein Icon unter assets/icon.icns gefunden. Überspringe."); }

    wizard.print(`.app Bundle erfolgreich erstellt unter: ${appBundlePath}`);
  }
}
