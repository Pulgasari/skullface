// @skullface/cli/wizard.ts

// :::::: ANSI COLOR CODES MAP

const COLORS = {
  reset   : '\x1b[0m',
  red     : '\x1b[31m',
  green   : '\x1b[32m',
  yellow  : '\x1b[33m',
  blue    : '\x1b[34m',
  magenta : '\x1b[35m',
  cyan    : '\x1b[36m',
  gray    : '\x1b[90m',
};

export type ColorName = keyof typeof COLORS;

export const color = {
  red     : (str: string) => `${COLORS.red}${str}${COLORS.reset}`,
  green   : (str: string) => `${COLORS.green}${str}${COLORS.reset}`,
  yellow  : (str: string) => `${COLORS.yellow}${str}${COLORS.reset}`,
  blue    : (str: string) => `${COLORS.blue}${str}${COLORS.reset}`,
  magenta : (str: string) => `${COLORS.magenta}${str}${COLORS.reset}`,
  cyan    : (str: string) => `${COLORS.cyan}${str}${COLORS.reset}`,
  gray    : (str: string) => `${COLORS.gray}${str}${COLORS.reset}`
};

// :::::: PRINTING

export function print   (...args: any[]) { console.log   (...args); }
//export function error   (...args: any[]) { console.error (...args); }
export function warn    (...args: any[]) { console.warn  (...args); }
export function success (...args: any[]) { console.log('\x1b[32m' + args.join(' ') + '\x1b[0m'); }

export function list (items: string[], title?: string) {
  if (title) console.log('\n' + title);
  items.forEach(item => console.log(`  - ${item}`));
}

export function separator (options: { color?: ColorName } = {}) {
  const line = '────────────────────────────────────────';
  if (options.color) console.log(`\n${COLORS[options.color]}${line}${COLORS.reset}`);
  else               console.log(`\n${line}`);
}

export function error (message: string, options: {}) {
  const prefix = color.red("[ERROR]");
  console.error(`${prefix} ${message}`);
  if (options.exit) Deno.exit(1);
  return undefined;
}

// :::::: PROMPTS

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

export default {
  ask, multiselect, select,
  error, print, success, warn,
  list, separator,
  color
};
