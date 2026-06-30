// @skullface/cli/packer/android.js

import Wizard from '@/wizard';
const wizard = new Wizard({ prefix: '[Packer:Android]' });

export const androidTemplatePath = new URL('./template', import.meta.url).pathname;

export default class {
  
  async packPlugin (projectRoot, pluginName) {
    // Target path inside the native Android boilerplate template
    const targetPath = `${projectRoot}/android-template/app/src/main/java/com/skullface/plugins/${pluginName}.kt`;
    
    // Read the flat file from the plugin folder
    const code = await Deno.readTextFile(`jsr:@skullface/plugins/${pluginName}/android.kt`);
    
    // Write it directly into the Android project structure
    await Deno.writeTextFile(targetPath, code);
  }

  async pack ({ projectRoot, appName, appSlug }) {
    wizard.print('Compiling and exporting Android platform assets ...');
      
    const outputDir = `${projectRoot}/dist-native/android`;
    await Deno.mkdir(outputDir, { recursive: true });

    // The CLI builder will copy your frontend build files into the Android assets directory:
    // Source: ${projectRoot}/dist -> Destination: packages/android/template/app/src/main/assets/www/
    // Afterwards, it triggers: `./gradlew assembleRelease` via Deno.Command
  }
  
}
