// @skullface/plugins/fs/api.ts

export async function readText (path: string): Promise<string> {
  return await Deno.readTextFile(path);
}

export async function writeText (path: string, text: string): Promise<void> {
  await Deno.writeTextFile(path, text);
}

export async function readJSON (path: string): Promise<any> {
  const text = await Deno.readTextFile(path);
  return JSON.parse(text);
}

export async function writeJSON (path: string, obj: any): Promise<void> {
  const text = JSON.stringify(obj, null, 2);
  await Deno.writeTextFile(path, text);
}

export async function exists (path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function copy (src: string, dest: string): Promise<void> {
  await Deno.copyFile(src, dest);
}

export async function remove (path: string): Promise<void> {
  await Deno.remove(path, { recursive: true });
}

export async function mkdir (path: string): Promise<void> {
  await Deno.mkdir(path, { recursive: true });
}

export async function walk (path: string, options: any = {}): Promise<Deno.DirEntry[]> {
  const results: Deno.DirEntry[] = [];
  for await (const entry of Deno.readDir(path)) {
    results.push(entry);
  }
  return results;
}
