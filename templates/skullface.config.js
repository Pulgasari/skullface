// skullface.config.ts
// Docs: {{docs}}/config.md

export default {
  
  // App-Metadaten
  app: {
    name    : "ExampleApp",
    slug    : "example-app",
    id      : "dev.skullface.example",
    version : "0.1.0"
  },

  // Aktivierte Framework-Plugins (wichtig für das dynamische Laden im Core!)
  plugins: [
    // Werden beim Projektdesign oder manuell eingetragen, z.B.:
    // "fs", 
    // "sqlite"
  ],

  // Entwicklungskonfiguration
  dev: {
    hmr  : true,
    port : 5173,
  },

  // Build-Einstellungen
  build: {
    entry  : "src/main.ts",
    outDir : "dist",
    
    cef     : false,
    runtime : "deno",
    
    // Zielplattformen für den Kompiliervorgang
    targets: [
      { platform: "linux", cef: true },
      { platform: "mac" },
      { platform: "windows" }
    ],
  },
  
};
