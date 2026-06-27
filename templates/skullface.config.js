// skullface.config.js
// Docs: {{docs}}/config.md

export default {
  // App Metadata
  app: {
    name: '{{name}}',
    slug: '{{slug}}',
    id: 'com.skullface.{{slug}}',
    version: '0.1.0'
  },

  // Active Runtime Plugins
  plugins: {{plugins}},

  // Development Configurations
  dev: {
    hmr: true,
    port: 5173,
  },

  // Build Configurations
  build: {
    entry: 'src/main.ts',
    outDir: 'dist',
    cef: false,
    runtime: 'deno',
    targets: [
      { platform: 'linux', cef: true },
      { platform: 'mac' },
      { platform: 'windows' }
    ],
  },
};
