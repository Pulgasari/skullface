// @skullface/cli/packer/windows.ts

import wizard from '@/wizard';
import { Packer } from "./mod.ts";

export class WindowsPacker implements Packer {
  async pack (binaryPath: string, projectRoot: string, appMeta: { name: string; slug: string; options: any }): Promise<void> {
    console.log("[Packer:Windows] Bereite Windows Release-Ordner vor...");

    const appName   = appMeta.name;
    const appSlug   = appMeta.slug;
    const outputDir = `${projectRoot}/dist-native/windows`;

    // 1. Ausgabe-Ordner erstellen
    await Deno.mkdir(outputDir, { recursive: true });

    // 2. Move .exe-File
    const targetBinaryPath = `${outputDir}/${appName}.exe`;
    await Deno.rename(binaryPath, targetBinaryPath);

    console.log(`[Packer:Windows] Windows-Anwendung verschoben nach: ${targetBinaryPath}`);

    // HINWEIS FÜR SPÄTER:
    // Wenn du das Icon der nackten .exe nachträglich manipulieren willst,
    // kannst du hier ein Win32-CLI-Tool wie 'rsrc' oder 'ResourceHacker' via Deno.Command einbinden:
    /*
    try {
      const iconChanger = new Deno.Command("ResourceHacker.exe", {
        args: ["-open", targetBinaryPath, "-save", targetBinaryPath, "-action", "addskip", "-res", "icon.ico", "-mask", "ICONGROUP,MAINICON,"]
      });
      await iconChanger.output();
    } catch {
       // Tool nicht da
    }
    */
  }
}
