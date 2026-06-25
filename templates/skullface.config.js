// skullface.config.ts
// Docs: {{docs}}/config.md

export default {
  
  // App Info
  app: {
    name    : "ExampleApp",
    slug    : "example-app",
    id      : "dev.skullface.example",
    version : "0.1.0"
  },

  // Dev Configurations
  dev: {
    hmr  : true,
    port : 5173,
  },

  // Build Configurations
  build: {
    entry  : "src/main.ts",
    outDir : "dist",
    
    // Defaults (apply to every target except overwritten)
    cef     : false,
    runtime : "deno", // blue | deno
    
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
      },
    ],
  },
  
};
