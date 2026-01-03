import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node16',
    outDir: 'dist',
    lib: {
      entry: './src/extension.ts',
      formats: ['cjs'],
      fileName: 'extension'
    },
    rollupOptions: {
      external: ['vscode']
    },
    minify: false,
    sourcemap: true
  }
});

