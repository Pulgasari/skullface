// @skullface/cli/packer/linux.js

import Wizard from '@/wizard';
const wizard = new Wizard ({ prefix: '[Packer:Linux]' });

export default class {
  async pack ({ binaryPath, projectRoot, appName, appSlug, options }) {
    wizard.print('Create Linux App Directory Structure ...');
    
    const appDir = `${projectRoot}/dist-native/linux/AppDir`;
    const binDir = `${appDir}/usr/bin`;

    // 1. Create AppDir-Directories
    await Deno.mkdir(binDir, { recursive: true });

    // 2. Move Binary-File
    const targetBinaryPath = `${binDir}/${appSlug}`;
    await Deno.rename(binaryPath, targetBinaryPath);
    await Deno.chmod(targetBinaryPath, 0o755);

    // 3. Create AppRun-Script
    const appRunContent = `#!/bin/sh
SELF=$(dirname "$(readlink -f "$0")")
exec "$SELF/usr/bin/${appName.toLowerCase()}" "$@"`;
    const appRunPath = `${appDir}/AppRun`;
    await Deno.writeTextFile(appRunPath, appRunContent);
    await Deno.chmod(appRunPath, 0o755); // make executable

    // 4. Create app.desktop-File
    const desktopContent = `[Desktop Entry]
Type=Application
Name=${appName}
Exec=${appName.toLowerCase()}
Icon=app
Categories=Utility;
Terminal=false
`;
    await Deno.writeTextFile(`${appDir}/${appSlug}.desktop`, desktopContent);

    // 5. Copy Plaeholder-Icon (Required for AppImage !!!)
    try   { await Deno.copyFile(`${projectRoot}/assets/icon.png`, `${appDir}/app.png`); }
    catch { await Deno.writeTextFile(`${appDir}/app.png`, ""); } // Create Empty Dummy-File if no Icon exists (to prevent crashing of appimagetool)

    // 6. Try to build the AppImage via 'appimagetool'
    wizard.print('Try compiling AppImage ...');
    try {
      const command = new Deno.Command('appimagetool', {
        args   : [appDir, `${projectRoot}/dist-native/linux/${appName}.AppImage`],
        stdout : 'piped',
        stderr : 'piped',
      });
      
      const { success, stderr } = await command.output();
      if (success) {
        wizard.success(`AppImage successfully created.`);
      } else {
        const errorMsg = new TextDecoder().decode(stderr);
        wizard.warn("'appimagetool' failed. Portabler AppDir-Ordner bleibt bestehen.", errorMsg);
      }
    } catch {
      wizard.info("'appimagetool' nicht im System-PATH gefunden. AppDir-Struktur wurde vorbereitet.");
    }
  }
}
