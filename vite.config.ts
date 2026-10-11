import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// APP_VERSION is set only by a release build (release.yml hands
// release-please's bare version to deploy.yml). Anything else is `dev` —
// never package.json's version, which is release-please's to bump.
export default defineConfig({
  plugins: [vue()],
  define: { __APP_VERSION__: JSON.stringify(process.env.APP_VERSION ?? 'dev') },
  // `bun run dev --host` is how a change is checked from another machine on
  // the LAN or tailnet; the box is reached by its hostname, which Vite's
  // host check refuses unless it is listed.
  server: { allowedHosts: ['imperial-construct'] },
})
