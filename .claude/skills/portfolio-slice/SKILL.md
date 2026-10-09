---
name: portfolio-slice
description: Interview Ashley about one system and add (or update) its entry on the portfolio site — copy, features, screens, Archify map. Use when asked to "slice", "add", or "refresh" a system on the portfolio.
---

# Portfolio slice

One run = one system = one FOLIO ticket. You **grill** the owner (short, pointed questions), **collect** real screens, **write** tight copy, and **wire** the entry into `src/data/systems.ts`. Never invent facts — if you don't know, ask or leave `TBD`.

## 0. Orient (silent, before asking anything)
- Read `CLAUDE.md` (the five invariants) and `src/data/systems.ts` → the `systems` array. Find the system if it exists; note `name`, `group`, hue `h`, and what is already filled. `src/data/pending-assets.ts` lists the paths it references that are not on disk yet.
- Look for source material the owner points you at: the system's repo, design project/files, README, `docs/architecture.archify.json`, running URL.
- From the repo, pull hard facts yourself: languages/frameworks (package files, Dockerfiles), surfaces (web/API/MCP/CLI/mobile), data stores, deploy target. Only ask about what you can't verify.

## 1. Grill (one round, 5–8 questions max)
Ask as a numbered list; offer your best guess for each so the owner can just say "yes".
1. **One-line tag** (≤ 7 words, a claim not a category). *e.g. "Agent delivery, with a human at the gate"*
2. **Blurb** — 2 sentences: what it does, and the one design idea that makes it different.
3. **Group** — Platform · Self-hosted · Small service · Experiment.
4. **Status** — Documented, or In development (pending → tile shows "In dev", no dossier).
5. **Core features** — 3–7. For each: title, the one screen that proves it, and *why it exists* (the problem, the decision, the trade-off).
6. **Which feature is the hero?** (shown first; rotates from there).
7. **Design language** — ≤ 6 words. *e.g. "Flat planes, hairlines, no bubbles"*
8. **Anything off-limits** — internal hostnames, customer names, secrets visible in screens.

Push back on vague answers ("it manages stuff" → "manages *what*, for *whom*, instead of *what*?"). Stop asking once you can write every field.

## 2. Collect assets → `public/systems/<slug>/`
Everything under `public/systems/` is served to anyone (invariant 1). Scrub before you commit, not after.
- **Screens, preferred:** the real design/app HTML pages. Copy each page plus its CSS/SVG dependencies into `public/systems/<slug>/`; references must be sibling-relative so the page loads standalone at `/systems/<slug>/<page>.html`. `SysScreen` shows the Nth `.sy` element (the app shell) scaled to fit; set `t` to pick which one. If the pages have no `.sy` wrapper, add `class="sy"` to the app-shell element in the copied file.
- **Screens, fallback:** PNG/WebP screenshots, ≥ 1600px wide, 16:10, cropped to the app (no browser chrome). A rail thumb goes in `public/systems/thumbs/<slug>.webp` and on `img`.
- **Archify:** authored in the owning repo as `docs/architecture.archify.json` (FOLIO-3), never here. Once it exists, `bun run archify` renders it to `public/systems/<slug>/archify.html` with `sources[]` and `meta.repository` stripped (invariant 5); point `arch` at that file. No IR yet → leave `arch` unset.
- **Scrub:** `grep -nE 'zerogravity\.industries|imperial-construct|172\.31\.|sw_[A-Za-z0-9]{8}|lyc_[A-Za-z0-9]{8}|@[a-z0-9.-]+\.(com|dev|net)' public/systems/<slug>/*` plus whatever Q8 named. Real hostnames, emails, tokens, a real person's message: remove or re-export the frame with placeholder data.
- A screen the owner has promised but not delivered goes on `pending-assets.ts` with the ticket key; the guard test fails on any other missing path.

## 3. Write the entry
Edit the system's object in `systems` (create it if new; array order = rail order). The shape is `System` in `src/data/types.ts`:

```ts
{
  name: 'Switchyard', group: 'Platform', h: 30,        // h = OKLCH hue 0–360, unique; keep existing, pick a free one if new
  tag: 'Agent delivery, with a human at the gate',
  blurb: 'Two sentences.',
  lang: 'TypeScript · Bun · Hono · Vue',               // " · " separated, most important first, ≤ 4
  surfaces: 'Web SPA · REST API · MCP server',
  design: 'Dense ops console, coral signal',
  arch: 'systems/switchyard/archify.html',             // omit until the render exists
  img: 'systems/thumbs/switchyard.webp',               // optional fallback when features have no screens
  features: [
    { title: 'Feature title', line: 'Short line (≤ 16 words).',
      screen: { src: 'systems/<slug>/page.html', t: 0 },
      explainer: 'Optional, 3–5 sentences.' },
  ],
}
```
Pending systems: `{ name, group, h, tag, pending: true }` only. Nothing else in the repo holds copy (invariant 2).

### Copy rules
- **Titles:** 1–3 words, noun phrase. No "Powerful", "Seamless", "Smart".
- **Short line:** what it does, concretely. ≤ 16 words.
- **Explainer (optional, 3–5 sentences):** problem → decision → consequence. Name the trade-off. Write for a peer engineer; a recruiter should still follow it.
- Sentence case, no emoji, no exclamation marks, no "we". Present tense.
- Every claim must be true of the shipped/designed system. Unknown → ask or leave it out.

## 4. Verify
- `bun run dev`, open `/#<slug>/1`; click the tile. Hero rotates through features; each screen loads, is scaled to the app shell, and nothing confidential is visible.
- Dossier → features list, Archify tab, Language/Surfaces/Design boxes all populated (no `TBD` unless agreed).
- Swipe/arrow through every feature. Do not add a link to the standalone design page — the stage is the only window onto it.
- Long names: check the hero name doesn't run under the screen wedge.
- Light and dark theme both read.
- `bun run verify` green (typecheck, guard test, build).
- **Ship:** branch `feat/<slug>-FOLIO-n`; PR title `feat(slice): <system> (FOLIO-n)` (copy or screen polish on a shipped dossier is a `fix:`). The PR body carries a Trestle screenshot of the dossier (`set -a; . ~/.config/trestle/trestle.env; set +a; trestle upload shot.png` → `![…](url)`), the `t` choices for multi-frame pages, and the scrub result. Comment the PR URL on the ticket.

## 5. Report back (≤ 5 lines)
What was added, what's still `TBD`, any copy you guessed and want confirmed, assets you still need.
