// @skullface/core/modules/filesystem.js

// :::::: API

export async function readText (path) {
  return await Deno.readTextFile(path);
}

export async function writeText (path, text) {
  await Deno.writeTextFile(path, text);
}

export async function readJSON (path) {
  const text = await Deno.readTextFile(path);
  return JSON.parse(text);
}

export async function writeJSON (path, obj) {
  const text = JSON.stringify(obj, null, 2);
  await Deno.writeTextFile(path, text);
}

export async function exists (path) {
  try        { await Deno.stat(path); return true; }
  catch (_e) { return false; }
}

export async function copy (src, dest) {
  await Deno.copyFile(src, dest);
},

export async function remove (path) {
  await Deno.remove(path, { recursive: true });
},

export async function mkdir (path) {
  await Deno.mkdir(path, { recursive: true });
},

export async function walk (path, _options = {}) {
  const results = [];
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

// :::::: DEFAULT

export default {
  copy,
  exists,
  mkdir,
  readJSON,
  readText,
  remove,
  walk,
  writeJSON,
  writeText,
}
