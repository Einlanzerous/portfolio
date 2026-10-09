# Portfolio

Ashley Dodson's systems portfolio — the services built under Zero Gravity
Industries, one dossier each: what it is, the features that matter, the
screens that prove them, and the architecture map.

**Live:** _pending first deploy_

## Stack

Vue 3 + Vite + TypeScript (strict), Bun. A static bundle served by
Cloudflare Workers static assets. No backend, no analytics.

```sh
bun install
bun run dev        # http://localhost:5173
bun run verify     # typecheck + test + build — the CI gate
```

## Adding a system

Content lives in one file, `src/data/systems.ts`, and is added by a *slice*:
the `portfolio-slice` skill (`.claude/skills/portfolio-slice/`) interviews
the owner about one system, collects real screens into
`public/systems/<slug>/`, and wires the entry. Architecture maps come from
each repo's own `docs/architecture.archify.json` — the file the estate wiki
also renders — via `bun run archify`.

## Deploy

Merging a `feat:` or `fix:` to `main` lets release-please open a release PR;
merging that cuts a `v*` tag, and `deploy.yml` builds with that version and
runs `wrangler deploy`. The footer shows the deployed version.
