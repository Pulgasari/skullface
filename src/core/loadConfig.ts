export async function loadConfig() {
  const mod = await import(`${Deno.cwd()}/skullface.config.ts`);
  return mod.default;
}
