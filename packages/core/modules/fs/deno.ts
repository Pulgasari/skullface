// @skullface/plugins/fs/deno.ts

// :::::: API

export const api = {
  async readText (path: string): Promise<string> {
    return await Deno.readTextFile(path);
  },

  async writeText (path: string, text: string): Promise<void> {
    await Deno.writeTextFile(path, text);
  },

  async readJSON (path: string): Promise<any> {
    const text = await Deno.readTextFile(path);
    return JSON.parse(text);
  },

  async writeJSON (path: string, obj: any): Promise<void> {
    const text = JSON.stringify(obj, null, 2);
    await Deno.writeTextFile(path, text);
  },

  async exists (path: string): Promise<boolean> {
    try {
      await Deno.stat(path);
      return true;
    } catch (_err) {
      return false;
    }
  },

  async copy (src: string, dest: string): Promise<void> {
    await Deno.copyFile(src, dest);
  },

  async remove (path: string): Promise<void> {
    await Deno.remove(path, { recursive: true });
  },

  async mkdir (path: string): Promise<void> {
    await Deno.mkdir(path, { recursive: true });
  },

  async walk (path: string, _options: any = {}): Promise<any[]> {
    const results: any[] = [];
    for await (const entry of Deno.readDir(path)) {
      results.push({
        isDirectory : entry.isDirectory,
        isFile      : entry.isFile,
        isSymlink   : entry.isSymlink,
        name        : entry.name,
      });
    }
    return results;
  }
  
};

// :::::: EXPORT

export default {
  api,
  name: 'fs',
  hooks: {
    onInit() {
      console.log('[FS] Native Deno file system plugin environment initialized.');
    }
  }
};
