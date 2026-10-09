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
      { title: 'Plan as PR', line: 'An agent opens a plan against the ticket. Nothing is built until a human merges it.', screen: { src: 'systems/switchyard/plan-as-pr.html', t: 0 },
        explainer: 'Before anything is built, an agent writes the whole change as one reviewable document: schema, migration phases, API contract, toggles, observability and rollback, with the UI listed last on purpose. Comments anchor to sections, and the argument stays in one shared thread. A revision is a force-push that shows what changed and which comment caused it. Approving is the merge: tickets open and the first one dispatches.' },
      { title: 'Environment matrix', line: 'Every service against every environment, with the promote queue on top.', screen: { src: 'systems/switchyard/matrix.html', t: 1 },
        explainer: 'One grid answers what is running where. The promote queue sits above it, so the next decision is always visible first. Failures and empty environments each get their own state, so the matrix reads at a glance instead of on hover.' },
      { title: 'Promote gate', line: 'Deploys stop at a human decision, with the evidence beside it.', screen: { src: 'systems/switchyard/promote-gate.html', t: 0 },
        explainer: 'Agents can build and verify, but promotion stops at a person. The gate puts the verification evidence next to the decision, so approving a deploy means reading what was checked rather than trusting a green light.' },
      { title: 'Verification panel', line: 'Both review passes, on the ticket itself.', screen: { src: 'systems/switchyard/verified-panel.html', t: 0 },
        explainer: 'Verification lives on the ticket detail, not in a separate tool. A failure says what failed and where. An empty state says nothing has been verified yet, instead of looking like a pass.' },
      { title: 'Feature flags', line: 'Toggles per service and environment, next to the deploys that need them.', screen: { src: 'systems/switchyard/feature-flags.html', t: 0 } },
      { title: 'LLM insights', line: 'Cost and effectiveness per job class, project and epic.', screen: { src: 'systems/switchyard/insights.html', t: 1 },
        explainer: 'Agent spend broken down the way the work is organised: by job class, by project and by epic. It shows which kinds of agent work are worth what they cost.' },
      { title: 'Self-assessment docket', line: 'The system grades its own delivery; findings become tickets.', screen: { src: 'systems/switchyard/docket.html', t: 0 },
        explainer: 'A monthly one-pager and a fuller quarterly edition where Switchyard assesses its own delivery. Each finding shows up as an ordinary ticket with its own detail page, so self-assessment turns into work instead of a report nobody reopens.' },
    ],
  },
  {
    name: 'Drydock', group: 'Platform', h: 235, img: 'systems/thumbs/drydock.webp',
    tag: 'Watch the agents work',
    blurb: 'A live dock for autonomous runs — what is underway, what is stuck, and what needs you right now.',
    surfaces: 'Web', design: 'Steel-blue dock, one card size',
    features: [
      { title: 'The run rail', line: 'Every active run on one rail at one card size; state is carried by glyph, word, motion and weight.' },
      { title: 'Needs you', line: 'Permission prompts surface inline on the card, not buried in a log.' },
      { title: 'Run history', line: 'Ended, finished, failed — each state reads at a squint.' },
    ],
  },
  {
    name: 'Signet', group: 'Platform', h: 295,
    tag: 'The credential vault for Zero Gravity Industries',
    blurb: 'A credential vault daemon behind the ZGI services, with an admin console in the Switchyard theme.',
    surfaces: 'Daemon · Admin console', design: 'Shares the Switchyard theme',
    features: [
      { title: 'Admin console', line: 'Credentials and the services that use them, in one place.', screen: { src: 'systems/switchyard/signet-admin.html', t: 0 } },
    ],
  },
  { name: 'Construct Server', group: 'Platform', h: 180, pending: true },
  {
    name: 'Argosy', group: 'Self-hosted', h: 75, img: 'systems/thumbs/argosy.webp',
    tag: 'Your library, every screen in sync',
    blurb: 'Owned media on your own hardware. Start a film on the train, finish it on the big screen — the whole fleet stays on the same frame.',
    surfaces: 'Web · TV · Mobile', design: 'Brass on charcoal',
    features: [
      { title: 'Fleet resume', line: 'Every paired device resumes at the same frame.' },
      { title: 'TV home', line: 'A ten-foot UI built for a remote.' },
      { title: 'Device pairing', line: 'Sign in once, name the screen, join the fleet.' },
      { title: 'Player', line: 'Chapters, tracks and a scrubber that respects your thumb.' },
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
