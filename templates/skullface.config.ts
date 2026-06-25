// skullface.config.ts

export default {
  
  // App Info
  app: {
    name    : "ExampleApp",
    slug    : "example-app",
    id      : "dev.skullface.example",
    version : "0.1.0"
  },

  // Build Configurations
  build: {
    // Defaults (apply to every target except overwritten)
    cef     : false,
    runtime : "deno",
    // Targets
    targets: [
      {
        platform: "android",
      {
        platform: "linux", // x86_64-unknown-linux-gnu
        cef: true,
      },
      {
        platform: "mac", // aarch64-apple-darwin
      },
      { 
        platform: "windows", // x86_64-pc-windows-msvc
      }
    ],
  },

  // deprecated ???
  
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
  
  plugins: [
    "clipboard",
    "hotkeys",
    "logger",
    "notifications",
    "router",
  ],
  
};
