import type { System } from './types'

export const CATS = ['All', 'Platform', 'Self-hosted', 'Small service', 'Experiment'] as const
export type Cat = (typeof CATS)[number]

// Order = rail order. Copy is the design's; slices (FOLIO-4) refine it.
export const systems: System[] = [
  {
    name: 'Switchyard', group: 'Platform', h: 30,
    tag: 'Agent delivery, with a human at the gate',
    blurb: 'Tickets in, verified deploys out. Agents plan as pull requests, humans approve the plan and hold the promote gate.',
    lang: 'TypeScript · Bun · Hono · Vue',
    surfaces: 'Web SPA · REST API · MCP server',
    design: 'Dense ops console, coral signal',
    arch: 'systems/switchyard/archify.html',
    features: [
      { title: 'Plan as PR', line: 'An agent opens a plan against the ticket. Nothing is built until a human merges it.', screen: { src: 'systems/switchyard/plan-as-pr.html', t: 0, at: '.pl-wrap' },
        explainer: 'Before anything is built, an agent writes the whole change as one reviewable document: schema, migration phases, API contract, toggles, observability and rollback, with the UI listed last on purpose. Comments anchor to sections, and the argument stays in one shared thread. A revision is a force-push that shows what changed and which comment caused it. Approving is the merge: tickets open and the first one dispatches.' },
      { title: 'Environment matrix', line: 'Every service against every environment, with the promote queue on top.', screen: { src: 'systems/switchyard/matrix.html', t: 1, at: '.segs' },
        explainer: 'One grid answers what is running where. The promote queue sits above it, so the next decision is always visible first. Failures and empty environments each get their own state, so the matrix reads at a glance instead of on hover.' },
      { title: 'Promote gate', line: 'Deploys stop at a human decision, with the evidence beside it.', screen: { src: 'systems/switchyard/promote-gate.html', t: 0, at: '.hop-hero' },
        explainer: 'Agents can build and verify, but promotion stops at a person. The gate puts the verification evidence next to the decision, so approving a deploy means reading what was checked rather than trusting a green light.' },
      { title: 'Verification panel', line: 'Both review passes, on the ticket itself.', screen: { src: 'systems/switchyard/verified-panel.html', t: 0, at: '.lrail' },
        explainer: 'Verification lives on the ticket detail, not in a separate tool. A failure says what failed and where. An empty state says nothing has been verified yet, instead of looking like a pass.' },
      { title: 'Feature flags', line: 'Toggles per service and environment, next to the deploys that need them.', screen: { src: 'systems/switchyard/feature-flags.html', t: 0, at: '.banner.warn' } },
      { title: 'LLM insights', line: 'Cost and effectiveness per job class, project and epic.', screen: { src: 'systems/switchyard/insights.html', t: 1, at: '.jb' },
        explainer: 'Agent spend broken down the way the work is organised: by job class, by project and by epic. It shows which kinds of agent work are worth what they cost.' },
      { title: 'Self-assessment docket', line: 'The system grades its own delivery; findings become tickets.', screen: { src: 'systems/switchyard/docket.html', t: 0, at: '.page-h' },
        explainer: 'A monthly one-pager and a fuller quarterly edition where Switchyard assesses its own delivery. Each finding shows up as an ordinary ticket with its own detail page, so self-assessment turns into work instead of a report nobody reopens.' },
    ],
  },
  {
    name: 'Drydock', group: 'Platform', h: 235, img: 'systems/thumbs/drydock.webp',
    tag: 'Agents run unattended; you answer the gates',
    blurb: 'A per-host daemon owns every agent\'s terminal; a web desk and a run rail let you watch, approve and step in. The daemon, not the browser, holds the session, so closing the tab costs nothing.',
    lang: 'TypeScript · Node · Vue 3 · xterm.js', surfaces: 'Web shell · Daemon (HTTP + WebSocket) · Claude Code hooks',
    design: 'Steel-blue dock, one card size',
    features: [
      { title: 'The run rail', line: 'Every unattended run on one rail at one card size; state reads from glyph, word, motion and weight.', screen: { src: 'systems/drydock/drydock.html' },
        explainer: 'An agent running on its own has no window to look at, so it gets a card instead. The rail owns the bottom edge in two lanes separated by depth: underway runs are raised and change by themselves, docked windows are recessed and change only when you touch them. Every card is the same size, so a failed run reads at a squint instead of hiding among the busy ones.' },
      { title: 'Needs you', line: 'A permission gate surfaces on the rail and is answered in place, not in a terminal.', screen: { src: 'systems/drydock/drydock.html?gate=open' },
        explainer: 'A PreToolUse hook holds the tool call open and the daemon turns it into a prompt on the rail: what the agent wants to run, where, and how long it has waited. Approve or deny there and the answer pre-empts the CLI\'s own prompt. How much a run may do unasked is host policy, shipped as manual. An unanswered gate waits an hour and is then denied.' },
      { title: 'Durable sessions', line: 'Many agents in flight on one desk; closing the browser, or restarting the daemon, kills none.', screen: { src: 'systems/drydock/drydock.html?layout=tile' },
        explainer: 'The daemon holds each terminal\'s PTY master for the life of the child; the browser is only a viewer that attaches and replays scrollback. Each PTY sits behind its own detached supervisor, so even a daemon restart leaves the agents running and it reattaches on boot. The cost is a second process per session and a wire protocol that must match, so a version bump is deliberate.' },
      { title: 'Ticket workspace', line: 'A ticket spawns an agent in its own worktree, with a shell beside it.', screen: { src: 'systems/drydock/drydock.html' },
        explainer: 'The tracker sits in the sidebar, grouped by repo with epics rolled up, and picking a ticket opens its brief. Spawning it opens one window with two terminals, the agent above and a shell below, and the ticket drawer pulls down over them instead of resizing them. Each ticket runs in its own git worktree, so two agents never share a working tree.' },
    ],
  },
  {
    name: 'Signet', group: 'Platform', h: 295,
    arch: 'systems/signet/archify.html',
    tag: 'The credential vault for Zero Gravity Industries',
    blurb: 'A credential vault daemon behind the ZGI services, with an admin console in the Switchyard theme.',
    lang: 'Go · SQLite', surfaces: 'Daemon · CLI · REST API · Admin console', design: 'Shares the Switchyard theme',
    features: [
      { title: 'Blind by design', line: 'Agents mint, rotate and fan out secrets without the plaintext passing through their transcript.', screen: { src: 'systems/switchyard/signet-credentials.html', t: 1 },
        explainer: 'Agents run most of this estate, and anything an agent reads ends up in a transcript. Signet is built so the common operations never need the value: generate mints one the agent never sees, rotate and sync seal and push new versions, and exec injects into a child process and redacts what comes back, which bounds accidents rather than guaranteeing silence. Setting a known value is the exception: it passes through whoever runs the command, so it is a person’s job. The HTTP mirror serves metadata and version hashes only, and reading a value back is a deliberate, audited reveal.' },
      { title: 'Admin console', line: 'Credentials per project, as a blind mirror: metadata and version hash, never the value.', screen: { src: 'systems/switchyard/signet-credentials.html', t: 0, at: '.callout' },
        explainer: 'Switchyard shows the vault without holding it. The console lists every credential a project owns with its version hash, scope and sync targets, and the plaintext is never returned to the browser. Rotate and add-target are requests to the Signet daemon, which seals the new version and pushes it out.' },
      { title: 'Secret detail', line: 'One secret: blind value, sync-target reconciliation, and its own hash chain.', screen: { src: 'systems/switchyard/signet-credentials.html', t: 1, at: '.sd-head' },
        explainer: 'Each secret carries its fan-out: which GitHub Actions secrets and env files hold which version, whether they are in sync, and a drift that was re-sealed on the last reconcile. Below it sits an append-only, hash-linked audit chain of rotations, so a credential can show its own history without ever showing its value.' },
    ],
  },
  { name: 'Construct Server', group: 'Platform', h: 180, pending: true },
  {
    name: 'Argosy', group: 'Self-hosted', h: 75, img: 'systems/thumbs/argosy.webp',
    tag: 'Your library, every screen in sync',
    blurb: 'Owned media on your own hardware. Start a film on the train, finish it on the big screen — the whole fleet stays on the same frame.',
    lang: 'Go · Postgres · Vue 3 · Flutter', surfaces: 'Web SPA · REST API · Android · TV', design: 'Brass on charcoal, mercantile',
    arch: 'systems/argosy/archify.html',
    features: [
      { title: 'Fleet resume', line: 'Open a title on any paired device and it offers the frame another device left it on.', screen: { src: 'systems/argosy/resume.webp' },
        explainer: 'Every device in an account shares one playhead, so the problem is not storing a position but moving it fast enough. Playback progress is written through Postgres and handed off with LISTEN/NOTIFY, so a phone that stops at the door is current on the TV before the remote is picked up. A plain Play asks, since the saved position may not be what you want; Continue Watching resumes silently, because there it is.' },
      { title: 'Home', line: 'The thing you were watching, over rails of what is in progress and what just arrived.', screen: { src: 'systems/argosy/home.webp' },
        explainer: 'The home page leads with the resume target, or a featured title when there is none, and names the device it was left on. Below it, Continue Watching and Newly Arrived mix films and series newest first, so a new episode and a new film compete on the same terms. Artwork and backdrops come from TMDB; the library itself never leaves the box.' },
      { title: 'Player', line: 'Direct play when the client can, remux when it must, transcode only as a last resort.', screen: { src: 'systems/argosy/player.webp' },
        explainer: 'Each session negotiates codecs per client and picks the cheapest path that works: direct play, a container remux, or a transcode to HLS with fMP4 segments. Transcodes are hardware encoded on Intel QSV, VAAPI or NVIDIA NVENC with a software fallback, and HEVC passes through untouched for true 4K and 10-bit HDR on clients that decode it. Seeks inside a transcode are done server side, so scrubbing does not re-encode what was skipped. Subtitles, embedded or fetched from OpenSubtitles, are served as WebVTT.' },
      { title: 'Fleet', line: 'Every authorized device, with rename and retire; retiring one drops it from sync.', screen: { src: 'systems/argosy/fleet.webp' },
        explainer: 'A device is a bearer token bound to a profile, listed with its platform and when it was last seen. Retire revokes the token and removes the device from the shared playhead in one step, which is also how a lost phone is handled. There is no per-device state to migrate, because the position never lived on the device.' },
      { title: 'Device pairing', line: 'A TV or phone shows a code; a device already signed in approves it.', screen: { src: 'systems/argosy/link.webp' },
        explainer: 'Typing a password on a television remote is the worst input path in the house, so the new device never asks for one. It shows a short code, and any device already in the fleet approves it, naming it on the way in. On the LAN the server advertises itself over mDNS, so the TV finds it without an address being typed either.' },
      { title: 'The Manifest', line: 'The whole hold on one page: films and series, filterable, sortable, with TMDB art.', screen: { src: 'systems/argosy/manifest.webp' },
        explainer: 'The library view is deliberately a grid of posters and nothing else, because the posters are the fastest way to find a title you own. Films and series share one grid with a kind badge rather than separate sections, with filters and sort by recency, title, year or rating. A periodic sweep keeps it current over a network mount where file-system notifications are unreliable.' },
    ],
  },
  {
    name: 'Lyceum', group: 'Self-hosted', h: 55, img: 'systems/thumbs/lyceum.webp',
    tag: 'A quiet place to read',
    blurb: 'A self-hosted reading room. Argosy’s bones with the volume turned down — the cover is the hero, chrome stays out of the way.',
    surfaces: 'Web · Mobile', design: 'Ochre on charcoal, warm paper',
    features: [
      { title: 'ISBN ingest', line: 'Scan or type an ISBN; the book arrives with its metadata.' },
      { title: 'Household accounts', line: 'Shared shelves, private progress.' },
      { title: 'Series', line: 'Reading order, gaps and what comes next.' },
      { title: 'Acquisition status', line: 'Know what is on its way and from where.' },
    ],
  },
  {
    name: 'Catenary', group: 'Self-hosted', h: 45, img: 'systems/thumbs/catenary.webp',
    arch: 'systems/catenary/archify.html',
    tag: 'One live conductor',
    blurb: 'A messaging client on overhead-wire logic: one copper accent carries every state — unread, active, playing — and nothing else competes for it.',
    lang: 'Vue 3 · TypeScript', surfaces: 'Web · Mobile', design: 'Flat planes, hairlines, no bubbles',
    features: [
      { title: 'The copper wire', line: 'A single accent carries state; everything else is structure.' },
      { title: 'Threads', line: 'Flat, tabular, built for scanning.' },
      { title: 'Mobile', line: 'The same wire, under a thumb.' },
    ],
  },
  {
    name: 'Chronicle', group: 'Self-hosted', h: 100, img: 'systems/thumbs/chronicle.webp',
    tag: 'Writing, with a voice in it',
    blurb: 'A page where speech lands inside the writing. Monochrome vellum on near-black.',
    surfaces: 'Web', design: 'Vellum on near-black, mono',
    features: [
      { title: 'Voice into page', line: 'Speak, and it lands on the ruled line.' },
      { title: 'The ledger', line: 'Entries read like a commonplace book.' },
      { title: 'Annotate', line: 'Margins for the second pass.' },
    ],
  },
  {
    name: 'Placard', group: 'Small service', h: 150,
    tag: 'A branding microserver',
    blurb: 'Logos and icons for every ZGI service, served from one place.',
    surfaces: 'API',
    features: [
      { title: 'Marks on demand', line: 'Every service fetches its logo and icon from one endpoint.' },
      { title: 'Sizes and formats', line: 'The right mark at the right size, without hand exports.' },
    ],
  },
  {
    name: 'CTA Watch', group: 'Small service', h: 15,
    tag: 'Transit and community engagement',
    blurb: 'Transit data put to work for the people who ride it.',
    features: [
      { title: 'Live transit', line: 'What is moving, what is late, and where.' },
      { title: 'Community', line: 'Riders report and engage around their lines.' },
    ],
  },
  { name: 'Centrifuge', group: 'Small service', h: 330, tag: 'Newsletter curator', pending: true },
  { name: 'Project Eidolon', group: 'Experiment', h: 265, tag: 'AgentOS', pending: true },
]

export function slugOf(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
