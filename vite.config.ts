import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    UnoCSS(),
    vue(),
    dts({
      outDir: resolve(__dirname, 'packages/dist'),
      tsconfigPath: resolve(__dirname, 'packages/tsconfig.json'),
      afterBuild() {
        const src = resolve(__dirname, 'packages/types/wangeditor.d.ts')
        const dst = resolve(__dirname, 'packages/dist/wangeditor.d.ts')
        fs.existsSync(src) && fs.copyFileSync(src, dst)
      },
    }),
  ],
  build: {
    outDir: 'packages/dist',
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'HxUI',
        fileName: (format) => format === 'es' ? 'index.es.js' : `index.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        /^vue/,
        /^element-plus/,
        /^@element-plus/,
        /^@iconify\/vue/,
      ],
      output: {
        assetFileNames: 'index.css',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          '@iconify/vue': 'IconifyVue',
        },
      },
    },
  },
})
