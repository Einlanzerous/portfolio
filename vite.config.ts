import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// APP_VERSION is set only by the release build (deploy.yml strips the tag's
// `v`). Anything else is `dev` — never package.json's pinned 0.0.0.
export default defineConfig({
  plugins: [vue()],
  define: { __APP_VERSION__: JSON.stringify(process.env.APP_VERSION ?? 'dev') },
})
