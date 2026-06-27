// @skullface/cli/utils/loadConfig.ts

export async function loadConfig (dir: string) {
  dir ??= Deno.cwd();
  const configPath = `${dir}/skullface.config.js`;
  
  try       { await Deno.stat(configPath); }
  catch (e) { console.error('SkullfaceConfig missing.'); }
  
  const mod = await import(configPath);
  //const mod = await import(`file://${configPath}`)
  return mod.default;
}
