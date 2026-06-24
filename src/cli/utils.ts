// cli/utils.js

// Templates Registry

export const TEMPLATE_REGISTRY = {
  datastar : "templates/datastar",
  htmx     : "templates/htmx",
  preact   : "templates/preact",
  react    : "templates/react",
  svelte   : "templates/svelte",
  vanilla  : "templates/vanilla",
};

export async function copyTemplate (name: string, target: string) {
  const src = TEMPLATE_REGISTRY[name];
  await Deno.mkdir(target, { recursive: true });

  for await (const entry of Deno.readDir(src)) {
    const from =    `${src}/${entry.name}`;
    const to   = `${target}/${entry.name}`;

    if (entry.isDirectory) {
      await copyTemplate(`${name}/${entry.name}`, to);
    } else {
      await Deno.copyFile(from, to);
    }
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
