import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': __dirname,
    },
  },
  plugins: [
    vue(),
    dts({
      outDir: resolve(__dirname, 'dist'),
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
      afterBuild() {
        const src = resolve(__dirname, 'types/wangeditor.d.ts')
        const dst = resolve(__dirname, 'dist/wangeditor.d.ts')
        fs.existsSync(src) && fs.copyFileSync(src, dst)
      },
    }),
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'index.ts'),
      formats: ['es'],
      fileName: () => '[name]',
    },
    rollupOptions: {
      external: [
        /^vue/,
        /^element-plus/,
        /^@element-plus/,
        /^@iconify\/vue/,
        /^@wangeditor\/editor/,
        /^@wangeditor\/editor-for-vue/,
        /^pdfjs-dist/,
        /^flv\.js$/,
        /^hls\.js$/,
        /^ol$/,
        /^ol\//,
        /^ol-layerswitcher/,
        /^geotiff/,
        /^rbush/,
        /^qrcode$/,
        /^axios$/,
        /^dayjs$/,
        /^vue-json-pretty$/,
        /^web-worker/,
        /^@antv\//,
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: __dirname,
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name && chunkInfo.name.endsWith('.css')) {
            return 'index.css'
          }
          return '[name][extname]'
        },
        format: 'es',
        exports: 'named',
      },
    },
  },
})