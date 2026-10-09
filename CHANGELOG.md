# Changelog

## [0.2.0](https://github.com/Einlanzerous/portfolio/compare/portfolio-v0.1.0...portfolio-v0.2.0) (2026-10-09)


### Features

* **slice:** Signet credentials screens (FOLIO-13) ([#6](https://github.com/Einlanzerous/portfolio/issues/6)) ([d58f2cc](https://github.com/Einlanzerous/portfolio/commit/d58f2cc90ec83bda66e91a3458aa369a7acbcf38))


### Bug Fixes

* **deploy:** custom domain portfolio.zerogravity.industries (FOLIO-9) ([#5](https://github.com/Einlanzerous/portfolio/issues/5)) ([324c6cb](https://github.com/Einlanzerous/portfolio/commit/324c6cb119c13e2f53cd74902f2cb526610713ab))
* **deploy:** FOLIO-9 — routes at top level (it was parsed as assets.routes), keep workers.dev, serve index via SPA fallback under html_handling=none ([#11](https://github.com/Einlanzerous/portfolio/issues/11)) ([53ef4fc](https://github.com/Einlanzerous/portfolio/commit/53ef4fcf49c191268f2c2e4904572204fd7ed84e))
* **dev:** FOLIO-5 — allow the box's hostname for bun run dev --host ([#9](https://github.com/Einlanzerous/portfolio/issues/9)) ([5685afb](https://github.com/Einlanzerous/portfolio/commit/5685afba049a8397091ef99b4943bd4bbaa67dea))
* **dossier:** FOLIO-6 — drop the 'Open full design' link; the stage is the only window onto a design page ([#8](https://github.com/Einlanzerous/portfolio/issues/8)) ([c277773](https://github.com/Einlanzerous/portfolio/commit/c27777307d4051b4f6f889774d9d9b819e5b316d))
* **hero:** FOLIO-6 — pause the rotation on mousemove, not a synthetic mouseenter at first load ([#12](https://github.com/Einlanzerous/portfolio/issues/12)) ([5dd4af3](https://github.com/Einlanzerous/portfolio/commit/5dd4af3a698a37be02d7119697c8f191806723f0))
* **rail:** FOLIO-6 — selected tile goes to the first slot, hero 50px taller, arrows beside the title on narrow screens ([#10](https://github.com/Einlanzerous/portfolio/issues/10)) ([7361a62](https://github.com/Einlanzerous/portfolio/commit/7361a624e44810fd1556ebc77bce9f3205a544cd))

## 0.1.0 (2026-10-09)


### Features

* **archify:** render switchyard's architecture map into the dossier (FOLIO-10) ([#3](https://github.com/Einlanzerous/portfolio/issues/3)) ([ccf341a](https://github.com/Einlanzerous/portfolio/commit/ccf341a75304a38626e81377fee2ea982180f45b))
* **deploy:** FOLIO-7 — static assets Worker, deploy on the release tag ([031637a](https://github.com/Einlanzerous/portfolio/commit/031637a639d8929ec8f32f22bc3d9c74e109bec5))
* **scaffold:** FOLIO-5 — Bun + Vite + Vue 3 + TS strict, release-please, CI, reviewer, CLAUDE.md / REVIEW.md ([b4de25d](https://github.com/Einlanzerous/portfolio/commit/b4de25de5b1b67475b13dedcf4d5d7d5b14b5659))
* **site:** FOLIO-6 — hero, dossier, systems rail, theme, SysScreen, typed data + guard test ([283f8e7](https://github.com/Einlanzerous/portfolio/commit/283f8e72a4e0ceed3435d0839c42965732ac4a88))
* **slice:** Switchyard screens, thumbs and the slice skill (FOLIO-12, FOLIO-11) ([#2](https://github.com/Einlanzerous/portfolio/issues/2)) ([1c7c265](https://github.com/Einlanzerous/portfolio/commit/1c7c2651b0690f0eb7c4a1f79484fac5934b95ae))


### Bug Fixes

* **deploy:** FOLIO-7 — serve .html screen paths as-is instead of a 307 to the extensionless path ([#4](https://github.com/Einlanzerous/portfolio/issues/4)) ([11c8a0c](https://github.com/Einlanzerous/portfolio/commit/11c8a0ca7aa5c97987a2070ff10665d5a10de542))
