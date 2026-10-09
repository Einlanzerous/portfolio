# CLAUDE.md — Portfolio

Ashley Dodson's public systems portfolio for Zero Gravity Industries. One
page: a hero that rotates through the selected system's feature screens, a
dossier per system (features, Archify architecture map, language / surfaces /
design), and a rail of every system. Static Vue 3 bundle on Cloudflare
Workers. No backend.

Tracked in Switchyard under **FOLIO**. Design of record is the Claude Design
project `07b64762-9ffa-481c-9ffe-1a47da51d9e5` (`Portfolio.dc.html`, with
`support.js` and `systems/sys-screen.js`), readable with the built-in
`DesignSync` tool — `get_file` with that `projectId`; `list_projects` will
not list it (it is not a design-system project) and that is not a lapsed
login.

## Layout

- `src/data/systems.ts` — **the one source of content.** Typed port of the
  design's `P` array; order = rail order; `h` is the OKLCH hue. The
  `portfolio-slice` skill edits it; nothing else should.
- `src/data/pending-assets.ts` — paths `systems.ts` references that are not
  on disk yet. The guard test fails on any missing path not listed here.
  Shrinks to empty as slices land.
- `src/site.ts` — owner, role, and the optional URLs (about, résumé, SSO).
  A nav item with a `null` URL is not rendered.
- `src/composables/useStage.ts` — all page state: selection, slide, open /
  arch, theme, filter, rotation, keyboard, touch, hash.
- `src/components/` — `AppHeader`, `HeroStage`, `Dossier`, `SystemsRail`,
  `AppFooter`, `SysScreen` (an HTML design page's Nth `.sy` app shell, or an
  image, scaled into a box).
- `public/systems/<slug>/` — the screens: real design pages plus their CSS,
  or ≥ 1600px screenshots; `archify.html` is the rendered architecture map.
- `scripts/render-archify.ts` — renders each repo's
  `docs/architecture.archify.json` to `public/systems/<slug>/archify.html`
  (FOLIO-3). Run by hand on the box; the output is committed.
- `.claude/skills/portfolio-slice/` — the runbook for adding or refreshing a
  system.

## Conventions

- Vue 3 Composition API, `<script setup lang="ts">`, TypeScript `strict`.
  Bun for packages and scripts; `bun run verify` (typecheck + test + build)
  is the gate, locally and in CI.
- Release-please + Conventional Commits with the ticket key in the subject:
  `feat(slice): Argosy (FOLIO-15)`. Branches `{type}/{slug}-{key}`. A slice
  is a `feat:`; copy or screen polish on a shipped dossier is a `fix:`.
- Comments say why, not what. No premature abstractions.

## Invariants

1. **Screens are public.** Every file under `public/systems/` is served to
   anyone. Scrub hostnames, emails, tokens, real user content before it is
   committed; a design frame with placeholder data is the preferred source.
2. **`systems.ts` is the only place content lives.** No copy in components,
   no second list of systems anywhere (the filters derive their counts from
   it).
3. **No dead links on the page.** Nav items and the SSO pill render only
   when there is something behind them. Design pages are shown only inside
   the stage — there is deliberately no "open the full design" link; the
   pages are how the screens are drawn, not something the site advertises.
   (`Open full map ↗` on the Archify tab stays: the map is the content.)
4. **Static bundle, no HTTP surface** (PRINCIPLES §4). There is no
   `/healthz` and this service is not registered in Switchyard's delivery
   ledger. The footer shows `__APP_VERSION__`: bare semver on a release
   build (deploy.yml strips the tag's `v`), `dev` everywhere else — never
   read from `package.json`.
5. **Archify renders are committed snapshots with evidence stripped.** The
   source of truth is the owning repo's `docs/architecture.archify.json` —
   the same file the estate wiki renders (SERV-159). The portfolio's copy
   drops `sources[]` and `meta.repository` before rendering because `SRC`
   deep links into a private repo are dead on a public page; the wiki
   carries the evidenced render. Authoring a map is that repo's work.

## Architecture maps

The dossier's **Archify HLA** tab frames `public/systems/<slug>/archify.html`.

- **Source of truth is the owning repo's `docs/architecture.archify.json`** —
  the file the estate wiki renders onto that repo's page (SERV-159).
  Authoring or fixing a map is that repo's work; nothing here edits an IR.
- **Rendered on the box, never in CI.** `bun run archify [slug…]`
  (`scripts/render-archify.ts`) uses construct-server's vendored archify
  (`ARCHIFY_DIR`, default `~/construct-server/wiki/vendor/archify`; 2.16.0 at
  the time of writing) — the portfolio does not vendor a second copy. The
  output is a committed snapshot refreshed by a slice; a stale map is a
  slice's job, not a build failure. `archify.src.json` beside it says which
  repo, path and revision it was rendered from, where the IR was read
  (`local` checkout or `github`), the archify version and the quality
  profile that passed.
- **Evidence is stripped on purpose** (invariant 5). The script deletes every
  `components[].sources` and `meta.repository` in memory before rendering.
  archify refuses to render evidenced IR without `--repo-root` and a git
  object store at the pinned revision, and even a verified render would put
  `SRC` deep links into a private repo on a public page. The wiki carries
  the evidenced render.
- **Quality profile.** The IR's own `meta.quality_profile` is tried first and
  `standard` is the fallback when it exits non-zero; the renderer's
  diagnostics are printed either way and belong in the PR body. The failing
  check is the IR author's to fix (switchyard: SWY-470).
- **Embedding.** `?embed=1` (chrome off, body sized to the frame),
  `?theme=dark|light` (overrides `localStorage` and `prefers-color-scheme`)
  and `#view=<chapter-id>` (guided views) are **undocumented template
  parameters** of archify's output — they live in `assets/template.html`,
  not in `references/`. Pan/zoom is `contentWindow.Archify.view.{zoomIn,
  zoomOut,reset}` (same origin); there is no wheel listener and `?embed=1`
  hides archify's own nav, so `Dossier.vue` supplies the buttons. The output
  has no `.sy` element: `SysScreen` targets `body` with `fit="contain"`. The
  Google Fonts link in the output stays (the site already loads Google
  Fonts). **Re-verify all of this when construct-server bumps the vendored
  version.**

## Testing

`bun run test` runs the data-file guard (`src/data/systems.test.ts`). There
is no browser test; the verify checklist in the slice skill is the manual
pass: light and dark, every screen scales to its app shell, swipe and
arrows step, long names stay clear of the hero wedge.
