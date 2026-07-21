import vue from '@astrojs/vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icons from 'unplugin-icons/vite'

// 本站是 CS Studio demo 集合（official-demo）的子站，
// 以純靜態檔案部署在 /minion/ 子路徑底下，不使用 SSR adapter。
// 建置產出 dist/ 要複製回 official-demo/minion/。
export default defineConfig({
  site: process.env.SITE_URL || 'https://csstudio-demo-360.netlify.app',
  base: '/minion',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    vue(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      icons({
        compiler: 'vue3',
      }),
    ],
  },
})
