import { defineConfig } from "skullface";

export default defineConfig ({
  meta: {
    name : "ExampleApp",
    slug : "example-app",
    id   : "dev.skullface.exmaple",
  },

  runtime  : "deno", // blue | deno
  template : "preact",

  entry: "src/main.ts",

  frontend: {
    outDir: "dist/frontend",
    devPort: 5173,
  },

  backend: {
    outDir: "dist/backend",
  },

  targets: [
    "x86_64-unknown-linux-gnu",
    "x86_64-pc-windows-msvc",
    "aarch64-apple-darwin",
  ],

  plugins: [
    "clipboard",
    "hotkeys",
    "logger",
    "notifications",
    "router",
  ],
});
