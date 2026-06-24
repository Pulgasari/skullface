// build/frontend.ts

export async function buildFrontend (ctx) {
  switch (ctx.config.template) {
    case "datastar" : return buildDatastar(ctx);
    case "htmx"     : return buildHTMX(ctx);
    case "preact"   : return buildPreact(ctx);
    default         : throw new Error("Unknown template: " + ctx.config.template);
  }
}

async function buildDatastar (ctx) {
  await Deno.mkdir(ctx.paths.frontend, { recursive: true });

  for await (const entry of Deno.readDir("frontend")) {
    await Deno.copyFile(
      `frontend/${entry.name}`,
      `${ctx.paths.frontend}/${entry.name}`,
    );
  }
}

async function buildHTMX (ctx) {
  await Deno.mkdir(ctx.paths.frontend, { recursive: true });

  for await (const entry of Deno.readDir("frontend")) {
    await Deno.copyFile(
      `frontend/${entry.name}`,
      `${ctx.paths.frontend}/${entry.name}`,
    );
  }
}

async function buildPreact (ctx) {
  const p = new Deno.Command("deno", {
    args: ["task", "build:frontend"],
  }).spawn();

  await p.status;
}
