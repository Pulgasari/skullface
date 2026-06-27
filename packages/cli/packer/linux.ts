// @skullface/cli/packer/linux.ts

import wizard from '@/wizard';
import { Packer } from "./mod.ts";

export class LinuxPacker implements Packer {
  async pack (binaryPath: string, projectRoot: string, appMeta: { name: string; slug: string; options: any }): Promise<void> {
    console.log("[Packer:Linux] Erstelle Linux AppDir-Struktur...");
    
    const appName = appMeta.name;
    const appSlug = appMeta.slug;
    const appDir  = `${projectRoot}/dist-native/linux/AppDir`;
    const binDir  = `${appDir}/usr/bin`;

    // 1. Create AppDir-Directories
    await Deno.mkdir(binDir, { recursive: true });

    // 2. Move Binary-File
    const targetBinaryPath = `${binDir}/${appName.toLowerCase()}`;
    await Deno.rename(binaryPath, targetBinaryPath);
    await Deno.chmod(targetBinaryPath, 0o755);

    // 3. Create AppRun-Script
    const appRunContent = `#!/bin/sh
SELF=$(dirname "$(readlink -f "$0")")
exec "$SELF/usr/bin/${appName.toLowerCase()}" "$@"
`;
    const appRunPath = `${appDir}/AppRun`;
    await Deno.writeTextFile(appRunPath, appRunContent);
    await Deno.chmod(appRunPath, 0o755); // Ausführbar machen!

    // 4. Create app.desktop-File
    const desktopContent = `[Desktop Entry]
Type=Application
Name=${appName}
Exec=${appName.toLowerCase()}
Icon=app
Categories=Utility;
Terminal=false
`;
    await Deno.writeTextFile(`${appDir}/${appName.toLowerCase()}.desktop`, desktopContent);

    // 5. Copy Plaeholder-Icon (Required for AppImage !!!)
    try {
      await Deno.copyFile(`${projectRoot}/assets/icon.png`, `${appDir}/app.png`);
    } catch {
      // Create Empty Dummy-File if no Icon exists (to prevent crashing of appimagetool)
      await Deno.writeTextFile(`${appDir}/app.png`, "");
    }

    // 6. Try to build the AppImage via 'appimagetool'
    console.log("[Packer:Linux] Versuche AppImage zu kompilieren...");
    try {
      const command = new Deno.Command("appimagetool", {
        args   : [appDir, `${projectRoot}/dist-native/linux/${appName}.AppImage`],
        stdout : "piped",
        stderr : "piped"
      });
      
      const { success, stderr } = await command.output();
      if (success) {
        console.log(`[Packer:Linux] AppImage erfolgreich erstellt im linux-Ordner!`);
      } else {
        const errorMsg = new TextDecoder().decode(stderr);
        console.warn("[Packer:Linux] appimagetool schlug fehl. Portabler AppDir-Ordner bleibt bestehen.", errorMsg);
      }
    } catch {
      console.info("[Packer:Linux] 'appimagetool' nicht im System-PATH gefunden. AppDir-Struktur wurde vorbereitet.");
    }
  }
}
