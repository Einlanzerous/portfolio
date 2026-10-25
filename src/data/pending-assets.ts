// Paths systems.ts references that are not on disk yet. The guard test fails
// on any missing path NOT listed here, so a typo cannot hide behind a slice
// that has not landed; the page treats a listed screen as "coming soon" rather
// than framing a 404. Remove entries as the files arrive:
export const pendingAssets = new Set<string>([
  // FOLIO-20: README shots are < 1600px and portrait; need >= 1600px 16:10 captures (mock data on the live site)
  'systems/cta-watch/lines.webp',
  'systems/cta-watch/fleet.webp',
  'systems/cta-watch/line.webp',
  'systems/cta-watch/stations.webp',
])
