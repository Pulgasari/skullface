// cli/utils.js

import { templates } from './registry.js';

// Templates

export async function copyTemplate (name: string, targetDir: string) {
  const sourceDir = templates[name];
  await Deno.mkdir(targetDir, { recursive: true });

  for await (const entry of Deno.readDir(sourceDir)) {
    const from = `${sourceDir}/${entry.name}`;
    const to   = `${targetDir}/${entry.name}`;

    entry.isDirectory
    ? await copyTemplate(`${name}/${entry.name}`, to)
    : await Deno.copyFile(from, to);
  }
}

// CLI Methods

export async function ask (question: string): Promise<string> {
  await Deno.stdout.write(new TextEncoder().encode(question + " "));
  const buf = new Uint8Array(1024);
  const n   = <number>await Deno.stdin.read(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
}

export async function select (question: string, options: string[]) {
  console.log("\n" + question);
  options.forEach((o, i) => console.log(`  ${i + 1}) ${o}`));

  while (true) {
    const answer = await ask("Choose number:");
    const index  = Number(answer) - 1;
    if (options[index]) return options[index];
  }
}

export async function multiselect (question: string, options: string[]) {
  console.log("\n" + question);
  options.forEach((o, i) => console.log(`  ${i + 1}) ${o}`));
  console.log("Enter numbers separated by comma (e.g. 1,3,5)");

  const answer  = await ask("Your selection:");
  const indices = answer.split(",").map(n => Number(n.trim()) - 1);

  return indices
    .filter (i => options[i])
    .map    (i => options[i]);
}

// Plugins

export async function enablePlugins (plugins: string[], dir: string) {
  const configPath = `${dir}/skullface.json`;

  let config = {};
  try {
    config = JSON.parse(await Deno.readTextFile(configPath));
  } catch {
    config = {};
  }

  config.plugins = plugins;

  await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));
}

// Variables

export async function applyVariables (vars: Record<string, string>, dir: string) {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;

    if (entry.isDirectory) {
      await applyVariables(vars, path);
      continue;
    }

    let text = await Deno.readTextFile(path);

    for (const [key, value] of Object.entries(vars)) {
      text = text.replaceAll(`{{${key}}}`, value);
    }

    await Deno.writeTextFile(path, text);
  }
}
