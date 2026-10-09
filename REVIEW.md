# Review instructions

What a review of *this* repo is for. The shared reviewer (construct-server
`docs/pr-reviewer.md`) supplies the procedure; this file supplies the
judgement. `CLAUDE.md` states the five invariants — read it first.

## What CI already proves

| job | proves |
|---|---|
| `verify` | `vue-tsc` under `strict`, the data-file guard test, and a production build |
| `lint` | actionlint over every workflow file |

Not proven by CI: that a screen is safe to publish, that the page still
reads in both themes, that a nav item has a target. Those are checked by
reading, below.

## Always check

1. **Anything added under `public/systems/`** (invariant 1). Open each new
   HTML or image. A real hostname, an email, a bearer-shaped string, a real
   person's message or note is 🔴 — the file is public the moment it merges,
   and edge caches outlive a revert.
2. **`src/data/systems.ts`** (invariant 2). Every claim is true of the
   shipped or designed system — the slice skill forbids invention. A `lang`
   or `surfaces` value should be checkable against the named repo. A
   feature whose screen does not exist on disk must be on
   `pending-assets.ts`; a shrinking list is the expected direction, a
   growing one needs a reason in the PR.
3. **Dead links** (invariant 3). A nav item, pill or button that points at
   `#` or nothing. 🟡 unless it shipped to the public site, then 🔴.
4. **Version** (invariant 4). Anything that derives `__APP_VERSION__` from
   `package.json`, or a Dockerfile / `/healthz` appearing — this is a static
   bundle and must stay declared as one.
5. **Archify** (invariant 5). A render committed with `sources[]` still in
   it, or a change to `scripts/render-archify.ts` that stops stripping
   evidence, or an IR authored *here* rather than in the owning repo.
6. **Visible change without an image.** A PR that changes anything on the
   page carries a Trestle screenshot (PRINCIPLES §5). Nit.

## Reviewing a plan

A FOLIO ticket's plan is read by Switchyard's adversarial plan pass before a
person is asked for their read. The pass has this checkout and the plan
JSON, and nothing else; a claim about another repository is *unverified*,
never *false*.

**What it verifies here.** Cited paths and symbols exist in this tree; a
plan that adds a system entry names a slice ticket and says where its
screens come from; a plan that touches `public/systems/` says what was
scrubbed; a plan that changes `scripts/render-archify.ts` keeps evidence
stripped (invariant 5) and keeps the source of truth in the owning repo;
every criterion has a `method` runnable from this tree (`bun run verify`, a
named manual check from the slice skill's §4). The five invariants are
blocking checks, named.

**Standing.** Advisory threads on a passing check; blocking only for a hole a
person would bounce. Scrutiny goes to a ruling's recommended option; the
others get an honesty check. It never picks a ruling, never supersedes, and
never approves a plan carrying a human-only ruling.

**Ready for a human** means: no blocking finding on the recommended path,
every genuine either/or has a ruling, every criterion is runnable. Reaching
it means a person is owed the rulings, not that the plan is approved.
