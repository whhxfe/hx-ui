import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = loadEnv('', process.cwd(), '')

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  plugins: [
    /** 显式指向仓库根 uno.config，避免仅依赖 cwd 向上查找 */
    UnoCSS({ configFile: resolve(__dirname, '../uno.config.ts') }),
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]',
      inject: 'body-last',
      customDomId: '__svg__icons__dom__',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@iconify-json': resolve(__dirname, '../node_modules/@iconify/json/json'),
      // CSS 文件需要指向 dist 目录（必须在 @hx/ui 之前，防止被更宽泛的别名覆盖）
      '@hx/ui/dist/index.css': resolve(__dirname, '../packages/dist/index.css'),
      // 直接解析到源码而不是 dist（指向 index.ts 而非目录，避免被 package.json#module 覆盖）
      '@hx/ui': resolve(__dirname, '../packages/index.ts'),
    },
  },
  server: {
    port: Number(env.PORT_PLAY) || 4002,
    host:'0.0.0.0',
    proxy: {
      '/api': {
        target: env.VITE_API_BASE_URL || 'http://localhost:4003',
        changeOrigin: true,
      },
      '/files': {
        target: env.VITE_API_BASE_URL || 'http://localhost:4003',
        changeOrigin: true,
      },
      '/icons': {
        target: env.VITE_API_BASE_URL || 'http://localhost:4003',
        changeOrigin: true,
      },
      '/uploads': {
        target: env.VITE_API_BASE_URL || 'http://localhost:4003',
        changeOrigin: true,
      },
    },
  },
})
