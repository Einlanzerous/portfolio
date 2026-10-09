<script setup lang="ts">
// Port of the design's <sys-screen>: shows the Nth `.sy` app shell of an HTML
// design page (or an image), scaled to fill this box. Layers are cached per
// src; changing src slides the new layer in from `dir` (1 = from the right,
// -1 = from the left, 0 = crossfade). The iframe is inert unless `interactive`
// (the Archify tab wants pan/zoom). `cover` fits the target's width and crops
// the rest (a screen); `contain` fits both axes and letterboxes in `bg` (a map
// whose bottom row must stay visible).
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  target?: number
  dir?: number
  fit?: 'cover' | 'contain'
  bg?: string
  preload?: string
  interactive?: boolean
}>(), { src: '', target: 0, dir: 0, fit: 'cover', bg: '#0b0f17', preload: '', interactive: false })

// The iframe currently on stage, for a parent that drives the framed page's
// own API (same origin: the Archify tab's zoom buttons).
defineExpose({ frame: () => cur?.ifr ?? null })

const IMG = /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i
const EASE = 'transform .5s cubic-bezier(.2,.7,.2,1), opacity .35s'

interface Layer { el: HTMLDivElement; t: number; img: boolean; ready: boolean; ifr?: HTMLIFrameElement; hideT?: number }

const host = ref<HTMLDivElement | null>(null)
const layers: Record<string, Layer> = {}
let cur: Layer | null = null
let curKey: string | null = null
let ro: ResizeObserver | null = null
let queued = false

const keyOf = (src: string, t: number) => src + '#' + t + '#' + props.fit

function make(src: string, t: number, key: string): Layer {
  const el = document.createElement('div')
  Object.assign(el.style, { position: 'absolute', inset: '0', overflow: 'hidden', visibility: 'hidden', opacity: '0', boxSizing: 'border-box' })
  const L: Layer = { el, t, img: IMG.test(src), ready: false }
  if (L.img) {
    const contain = props.fit === 'contain'
    Object.assign(el.style, {
      backgroundImage: `url("${src}")`, backgroundRepeat: 'no-repeat',
      backgroundSize: contain ? 'contain' : 'cover', backgroundPosition: contain ? 'center' : 'top left',
      backgroundOrigin: 'content-box', padding: contain ? '14px' : '0', backgroundColor: contain ? props.bg : 'transparent',
    })
    L.ready = true
  } else {
    const ifr = document.createElement('iframe')
    ifr.setAttribute('scrolling', 'no'); ifr.tabIndex = -1; ifr.setAttribute('aria-hidden', 'true')
    Object.assign(ifr.style, {
      position: 'absolute', left: '0', top: '0', border: '0', width: '1560px', height: '1000px',
      transformOrigin: '0 0', pointerEvents: props.interactive ? 'auto' : 'none', background: 'transparent',
    })
    L.ifr = ifr
    ifr.onload = () => { L.ready = true; layout(L); setTimeout(() => layout(L), 400); if (cur === L) el.style.opacity = '1' }
    ifr.src = src
    el.appendChild(ifr)
  }
  host.value?.appendChild(el)
  layers[key] = L
  return L
}

function layout(L: Layer) {
  if (L.img || !L.ready || !L.ifr || !host.value) return
  let doc: Document | null
  try { doc = L.ifr.contentDocument } catch { return }
  if (!doc || !doc.body) return
  const els = doc.querySelectorAll<HTMLElement>('.sy')
  const el = els[L.t] || els[0] || doc.body
  doc.documentElement.style.overflow = 'hidden'
  const W = host.value.clientWidth || 1, H = host.value.clientHeight || 1
  if (props.fit === 'contain') {
    // The frame keeps its natural size (archify's embed lays out from the
    // iframe width, so offsetWidth is the width we gave it) and is scaled
    // until both axes fit, then centred; the letterbox is painted to match.
    const w = el.offsetWidth || 1560, h = el.offsetHeight || 1000, sc = Math.min(W / w, H / h)
    Object.assign(L.ifr.style, { width: w + 'px', height: h + 'px', transform: `scale(${sc})`, left: (W - w * sc) / 2 + 'px', top: (H - h * sc) / 2 + 'px' })
    L.el.style.background = props.bg
    return
  }
  const w = el.offsetWidth || 1560, sc = W / w
  L.ifr.style.width = w + 'px'
  L.ifr.style.height = Math.ceil(H / sc) + 'px'
  L.ifr.style.transform = `scale(${sc})`
  const ifr = L.ifr
  requestAnimationFrame(() => {
    const win = ifr.contentWindow
    if (!win) return
    const r = el.getBoundingClientRect()
    win.scrollTo(r.left + win.scrollX, r.top + win.scrollY)
  })
}

function show() {
  const src = props.src, t = props.target
  props.preload.split(',').map(x => x.trim()).filter(Boolean).forEach(p => { const k = keyOf(p, 0); if (!layers[k]) make(p, 0, k) })
  const key = src ? keyOf(src, t) : null
  if (key === curKey) return
  const prev = cur, dir = props.dir
  const L = key ? (layers[key] ?? make(src, t, key)) : null
  cur = L; curKey = key
  for (const o of Object.values(layers)) if (o !== L && o !== prev) { o.el.style.transition = 'none'; o.el.style.visibility = 'hidden' }
  if (L) {
    clearTimeout(L.hideT)
    layout(L)
    const el = L.el
    el.style.transition = 'none'; el.style.visibility = 'visible'; el.style.zIndex = '2'
    el.style.transform = prev && dir ? `translateX(${dir * 100}%)` : 'none'
    el.style.opacity = prev && dir ? (L.ready ? '1' : '0') : '0'
    void el.offsetWidth
    el.style.transition = EASE; el.style.transform = 'translateX(0)'; el.style.opacity = L.ready ? '1' : '0'
  }
  if (prev && prev !== L) {
    const el = prev.el
    el.style.zIndex = '1'; el.style.transition = EASE
    if (dir && L) el.style.transform = `translateX(${-dir * 100}%)`; else el.style.opacity = '0'
    clearTimeout(prev.hideT)
    prev.hideT = window.setTimeout(() => { if (cur !== prev) el.style.visibility = 'hidden' }, 540)
  }
}

function queue() { if (queued) return; queued = true; queueMicrotask(() => { queued = false; show() }) }

onMounted(() => {
  ro = new ResizeObserver(() => Object.values(layers).forEach(layout))
  if (host.value) ro.observe(host.value)
  queue()
})
onBeforeUnmount(() => { ro?.disconnect(); ro = null })
watch(() => [props.src, props.target, props.fit, props.preload], queue)
watch(() => props.bg, () => { if (cur) layout(cur) })
watch(() => props.interactive, v => { for (const L of Object.values(layers)) if (L.ifr) L.ifr.style.pointerEvents = v ? 'auto' : 'none' })
</script>

<template>
  <div ref="host" class="sys-screen"></div>
</template>

<style scoped>
.sys-screen { display: block; position: relative; overflow: hidden; width: 100%; height: 100%; }
</style>
