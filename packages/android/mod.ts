// @skullface/android/mod.ts
// This package acts as the asset provider and orchestrator for Android platform targets

export const androidTemplatePath = new URL('./template', import.meta.url).pathname;

export function getAndroidPacker() {
  return {
    async pack (projectRoot: string, appMeta: { name: string; slug: string }) {
      console.log('[Packer:Android] Compiling and exporting Android platform assets...');
      
      const outputDir = `${projectRoot}/dist-native/android`;
      await Deno.mkdir(outputDir, { recursive: true });

      // The CLI builder will copy your frontend build files into the Android assets directory:
      // Source: ${projectRoot}/dist -> Destination: packages/android/template/app/src/main/assets/www/
      // Afterwards, it triggers: `./gradlew assembleRelease` via Deno.Command
    }
  };
}
