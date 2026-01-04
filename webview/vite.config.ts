import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    outDir: '../dist/webview',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: (id) => {
          // Split heavy dependencies into separate chunks for lazy loading
          if (id.includes('node_modules/mermaid')) {
            return 'vendor-mermaid'
          }
          if (id.includes('node_modules/katex')) {
            return 'vendor-katex'
          }
          // Split Tiptap packages into their own chunk (large editor library)
          if (id.includes('node_modules/@tiptap') || id.includes('node_modules/tiptap')) {
            return 'vendor-tiptap'
          }
          // Keep other node_modules together
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  base: './'
})
