import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { systems, slugOf, CATS, type Cat } from '../data/systems'
import type { Feature, Screen, System } from '../data/types'
import { pendingAssets } from '../data/pending-assets'

export type Theme = 'system' | 'light' | 'dark'

export interface Projected extends System {
  index: number
  slug: string
  serial: string
  tag: string
  blurb: string
  lang: string
  surfaces: string
  design: string
  acc: string
  nameSize: string
  field: string
  tileArt: string
  stage: string
}

const PENDING_FEATURE: Feature = {
  title: 'In development',
  line: 'A dossier for this system lands once it is far enough along — features, screens and the Archify diagram.',
}

export function featsOf(p: System): Feature[] {
  return p.pending && !p.features?.length ? [PENDING_FEATURE] : (p.features ?? [])
}

const pad = (n: number) => String(n).padStart(2, '0')

export function project(p: System, i: number): Projected {
  const H = p.h
  const px = Math.min(210, Math.floor(1300 / Math.max(p.name.length, 1)))
  return {
    ...p,
    index: i,
    slug: slugOf(p.name),
    serial: 'ZGI-' + pad(i + 1),
    tag: p.tag || 'In development',
    blurb: p.blurb || (p.pending ? 'Still being built. The dossier lands once there is enough to show.' : ''),
    lang: p.lang || 'TBD',
    surfaces: p.surfaces || 'TBD',
    design: p.design || 'TBD',
    acc: `oklch(0.7 0.17 ${H})`,
    nameSize: `min(${px}px, ${(px / 14.4).toFixed(2)}vw)`,
    field: p.pending
      ? `repeating-linear-gradient(135deg, rgba(0,0,0,.07) 0 1px, transparent 1px 12px), oklch(0.82 0.08 ${H})`
      : `repeating-linear-gradient(135deg, rgba(0,0,0,.05) 0 1px, transparent 1px 13px), oklch(0.76 0.15 ${H})`,
    tileArt: `radial-gradient(120% 130% at 100% 0%, oklch(0.62 0.19 ${H} / .75), transparent 62%), repeating-linear-gradient(135deg, oklch(0.72 0.15 ${H} / .12) 0 1px, transparent 1px 10px), var(--card)`,
    stage: `repeating-linear-gradient(135deg, oklch(0.7 0.15 ${H} / .12) 0 1px, transparent 1px 12px), var(--card)`,
  }
}

export const projected: Projected[] = systems.map(project)

const THEME_KEY = 'portfolio.theme'
const THEMES: Theme[] = ['system', 'light', 'dark']
const isTheme = (v: unknown): v is Theme => typeof v === 'string' && (THEMES as string[]).includes(v)

function readTheme(): Theme {
  try { const v = localStorage.getItem(THEME_KEY); return isTheme(v) ? v : 'system' } catch { return 'system' }
}
function writeTheme(t: Theme) {
  try { localStorage.setItem(THEME_KEY, t) } catch { /* private window, blocked storage — the page still works */ }
}

function parseHash(): { sel: number; open: boolean; slide: number } | null {
  const raw = location.hash.replace(/^#/, '')
  if (!raw) return null
  const [slug, n] = raw.split('/')
  const sel = projected.findIndex(p => p.slug === slug)
  if (sel < 0) return null
  const count = featsOf(projected[sel]!).length
  const idx = n ? parseInt(n, 10) - 1 : NaN
  const open = Number.isInteger(idx) && idx >= 0 && idx < count
  return { sel, open, slide: open ? idx : 0 }
}

export function useStage(opts: { heroSeconds?: number; serviceSeconds?: number } = {}) {
  const heroSeconds = opts.heroSeconds ?? 6
  const serviceSeconds = opts.serviceSeconds ?? 6

  const s = reactive({
    sel: 0, slide: 0, dir: 0, open: false, arch: false,
    theme: readTheme() as Theme, sysDark: true,
    filter: 'All' as Cat, heroPaused: false, driving: false,
  })
  const stageEl = ref<HTMLElement | null>(null)
  const railEl = ref<HTMLElement | null>(null)

  const raw = computed(() => systems[s.sel]!)
  const cur = computed(() => projected[s.sel]!)
  const feats = computed(() => featsOf(raw.value))
  const slide = computed(() => s.slide % feats.value.length)
  const feature = computed(() => feats.value[slide.value]!)
  // A screen whose file has not landed yet (pending-assets.ts) is treated as no
  // screen: the stage says "coming soon" instead of framing a 404.
  const avail = (sc: Screen | undefined): Screen | null => sc && !pendingAssets.has(sc.src) ? sc : null
  const featureScreen = computed(() => avail(feature.value.screen))
  const screen = computed(() => featureScreen.value ?? (raw.value.img ? avail({ src: raw.value.img, t: 0 }) : null))
  const preload = computed(() => feats.value.map(f => avail(f.screen)?.src).filter((x): x is string => !!x).join(','))
  const archSrc = computed(() => raw.value.arch && !pendingAssets.has(raw.value.arch) ? raw.value.arch : '')
  const dark = computed(() => s.theme === 'system' ? s.sysDark : s.theme === 'dark')

  let heroLast = Date.now()
  const touch = () => { heroLast = Date.now() }

  function step(delta: number, auto = false) {
    const n = feats.value.length
    if (n < 2) return
    touch()
    s.slide = (s.slide + delta + n) % n
    s.dir = delta > 0 ? 1 : -1
    s.arch = false
    if (!auto) s.driving = s.open || s.driving
  }
  function goSlide(i: number) {
    touch()
    s.dir = i === s.slide ? 0 : (i > s.slide ? 1 : -1)
    s.slide = i
    s.arch = false
    s.driving = s.open || s.driving
  }
  function select(i: number) {
    touch()
    s.dir = i === s.sel ? 0 : (i > s.sel ? 1 : -1)
    s.sel = i; s.slide = 0; s.arch = false; s.driving = false
    scrollToStage()
  }
  function openAt(arch: boolean) {
    touch()
    s.open = true; s.arch = arch; s.dir = 0; s.driving = arch
    scrollToStage()
  }
  function close() { touch(); s.open = false; s.arch = false; s.dir = 0; s.driving = false }
  function showFeat() { s.arch = false; s.dir = 0; s.driving = true }
  function showArch() { s.arch = true; s.dir = 0; s.driving = true }
  function cycleTheme() { s.theme = ({ system: 'light', light: 'dark', dark: 'system' } as const)[s.theme] }
  function heroPause() { s.heroPaused = true }
  function heroResume() { touch(); s.heroPaused = false }
  function setFilter(c: Cat) { s.filter = c }

  function scrollToStage() {
    const el = stageEl.value
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top < -40 || top > window.innerHeight * 0.5) window.scrollTo({ top: window.scrollY + top - 16, behavior: 'smooth' })
  }
  function railBy(sign: 1 | -1) {
    const el = railEl.value
    if (el) el.scrollBy({ left: sign * el.clientWidth * 0.8 })
  }

  // Touch: a horizontal swipe steps; the thresholds are the design's.
  let tx: number | null = null, ty = 0
  function touchStart(e: TouchEvent) { const t = e.touches[0]; if (t) { tx = t.clientX; ty = t.clientY } }
  function touchEnd(e: TouchEvent) {
    const t = e.changedTouches[0]
    if (!t || tx == null) return
    const dx = t.clientX - tx, dy = t.clientY - ty
    tx = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1)
  }

  // The rail scrolls sideways on a vertical wheel, but hands the event back
  // to the page at either end so the visitor is never trapped in it.
  function railWheel(e: WheelEvent) {
    const el = railEl.value
    if (!el || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
    const max = el.scrollWidth - el.clientWidth
    if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max - 1)) return
    e.preventDefault()
    el.style.scrollBehavior = 'auto'
    el.scrollLeft += e.deltaY
    el.style.scrollBehavior = 'smooth'
  }

  let tick = 0
  let mq: MediaQueryList | null = null
  const onMq = (e: MediaQueryListEvent) => { s.sysDark = e.matches }
  const onKey = (e: KeyboardEvent) => {
    if (/input|textarea/i.test((e.target as HTMLElement | null)?.tagName ?? '')) return
    if (e.key === 'Escape' && s.open) close()
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }
  const onHash = () => {
    const h = parseHash()
    if (!h) return
    if (h.sel !== s.sel) { s.sel = h.sel; s.slide = 0; s.dir = 0 }
    s.open = h.open
    if (h.open) s.slide = h.slide
    s.arch = false
  }
  function writeHash() {
    const want = '#' + cur.value.slug + (s.open ? '/' + (slide.value + 1) : '')
    if (location.hash !== want) history.replaceState(null, '', want)
  }

  onMounted(() => {
    mq = window.matchMedia('(prefers-color-scheme: dark)')
    s.sysDark = mq.matches
    mq.addEventListener('change', onMq)
    window.addEventListener('keydown', onKey)
    window.addEventListener('hashchange', onHash)
    onHash()
    heroLast = Date.now()
    tick = window.setInterval(() => {
      if (s.open ? (s.driving || s.arch) : s.heroPaused) return
      if (Date.now() - heroLast < (s.open ? serviceSeconds : heroSeconds) * 1000) return
      if (feats.value.length < 2) return
      step(1, true)
    }, 250)
  })
  onUnmounted(() => {
    clearInterval(tick)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('hashchange', onHash)
    mq?.removeEventListener('change', onMq)
  })

  watch(() => s.theme, writeTheme)
  watch(() => [s.sel, s.open, slide.value], writeHash)

  const tiles = computed(() => projected.filter(p => s.filter === 'All' || p.group === s.filter))
  const filters = computed(() => CATS.map(c => ({
    label: c,
    count: c === 'All' ? projected.length : projected.filter(p => p.group === c).length,
    on: s.filter === c,
  })))

  return {
    s, stageEl, railEl,
    cur, feats, slide, feature, screen, featureScreen, archSrc, preload, dark, tiles, filters,
    step, goSlide, select, openAt, close, showFeat, showArch, cycleTheme,
    heroPause, heroResume, setFilter, railBy, railWheel, touchStart, touchEnd,
  }
}
