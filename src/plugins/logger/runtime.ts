// plugins/logger/runtime.ts

import { colors } from "./colors.ts";

export function injectRuntime(ctx) {
  const target = `${ctx.paths.backend}/logger.runtime.js`;
  Deno.writeTextFileSync(target, RUNTIME_CODE);
}

const RUNTIME_CODE = `
(function() {
  const colors = {
    reset: "\\x1b[0m",
    gray: "\\x1b[90m",
    red: "\\x1b[91m",
    green: "\\x1b[92m",
    yellow: "\\x1b[93m",
    blue: "\\x1b[94m",
    magenta: "\\x1b[95m",
    cyan: "\\x1b[96m",
    white: "\\x1b[97m",
    bold: "\\x1b[1m"
  };

  const levelColors = {
    info    : colors.cyan,
    warn    : colors.yellow,
    error   : colors.red,
    success : colors.green,
    debug   : colors.gray
  };

  let indent = 0;

  function pad() {
    return " ".repeat(indent * 2);
  }

  const api = {
    log(level, ...args) {
      const color = levelColors[level] || colors.white;
      console.log(pad() + color + "[" + level.toUpperCase() + "]" + colors.reset, ...args);
    },

    group(label) {
      const start = performance.now();
      console.log(pad() + colors.bold + label + colors.reset);
      indent++;

      return {
        log(...args) {
          console.log(pad() + "•", ...args);
        },
        end() {
          indent--;
          const ms = (performance.now() - start).toFixed(1);
          console.log(pad() + colors.gray + "↳ done in " + ms + "ms" + colors.reset);
        }
      };
    }
  };

  globalThis.__skullface_logger = api;
})();
`;
