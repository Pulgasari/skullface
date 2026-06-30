import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import preact from '@preact/preset-vite'; // Example for Preact template
import skullfaceConfig from './skullface.config.js';

const customAutoImports = skullfaceConfig.frontend?.autoimport || {};

export default defineConfig({
  plugins: [
    preact(),
    AutoImport({
      imports: [ customAutoImports ],
      dts: './skullface-auto-imports.d.ts'
    })
  ]
});
