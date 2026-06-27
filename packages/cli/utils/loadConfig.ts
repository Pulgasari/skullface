// @skullface/cli/utils/loadConfig.ts

export interface SkullfaceConfig {
  app?: {
    name?: string;
    slug?: string;
  };
  build?: {
    targets?: (string | { platform: string; [key: string]: any })[];
  };
}

export async function loadConfig (dir?: string): Promise<SkullfaceConfig> {
  const targetDir = dir ?? Deno.cwd();
  const configPath = `${targetDir}/skullface.config.js`;
  
  try {
    await Deno.stat(configPath); // does config-file exist?
    const mod = await import(`file://${configPath}`);
    return mod.default || {};
  } catch (_e) {
    console.warn("Keine 'skullface.config.js' gefunden. Nutze Standardwerte.");
    return {};
  }
}
