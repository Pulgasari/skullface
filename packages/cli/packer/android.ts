// @skullface/cli/src/packer/android.ts

export class AndroidPacker implements Packer {
  
  async packPlugin (projectRoot: string, pluginName: string) {
    // Target path inside the native Android boilerplate template
    const targetPath = `${projectRoot}/android-template/app/src/main/java/com/skullface/plugins/${pluginName}.kt`;
    
    // Read the flat file from the plugin folder
    const code = await Deno.readTextFile(`jsr:@skullface/plugins/${pluginName}/android.kt`);
    
    // Write it directly into the Android project structure
    await Deno.writeTextFile(targetPath, code);
  }
  
}
