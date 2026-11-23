import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// APP_VERSION is set only by a release build (release.yml hands
// release-please's bare version to deploy.yml). Anything else is `dev` —
// never package.json's version, which is release-please's to bump.
export default defineConfig({
  // Browser target (CLAUDE.md): a Firefox 160 floor. The other engines are Baseline Widely available.
  // Rolldown takes explicit versions, not the `baseline-widely-available` keyword,
  // so these are that keyword's engines (Vite 8) with Firefox raised to 160.
  build: { target: ['chrome111', 'edge111', 'firefox160', 'safari16.4'] },
  plugins: [vue()],
  define: { __APP_VERSION__: JSON.stringify(process.env.APP_VERSION ?? 'dev') },
  // `bun run dev --host` is how a change is checked from another machine on
  // the LAN or tailnet; the box is reached by its hostname, which Vite's
  // host check refuses unless it is listed.
  server: { allowedHosts: ['imperial-construct'] },
})
