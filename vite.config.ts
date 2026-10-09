import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// APP_VERSION is set only by the release build (deploy.yml strips the tag's
// `v`). Anything else is `dev` — never package.json's pinned 0.0.0.
export default defineConfig({
  plugins: [vue()],
  define: { __APP_VERSION__: JSON.stringify(process.env.APP_VERSION ?? 'dev') },
  // `bun run dev --host` is how a change is checked from another machine on
  // the LAN or tailnet; the box is reached by its hostname, which Vite's
  // host check refuses unless it is listed.
  server: { allowedHosts: ['imperial-construct'] },
})
