<script setup lang="ts">
import { computed, ref } from 'vue'
import SysScreen from './SysScreen.vue'
import type { Projected } from '../composables/useStage'
import type { Feature, Screen } from '../data/types'

const props = defineProps<{
  d: Projected
  feats: Feature[]
  slide: number
  screen: Screen | null
  preload: string
  dir: number
  arch: boolean
  archSrc: string
  dark: boolean
}>()
const emit = defineEmits<{ close: []; showFeat: []; showArch: []; go: [i: number]; step: [d: number]; touchStart: [e: TouchEvent]; touchEnd: [e: TouchEvent] }>()
const pad = (n: number) => String(n).padStart(2, '0')

const cur = computed(() => props.feats[props.slide]!)
const idx = computed(() => props.arch ? 'ARCHIFY' : `${pad(props.slide + 1)} / ${pad(props.feats.length)}`)
const label = computed(() => props.arch
  ? `Archify · ${props.d.name}${props.archSrc ? '' : ' · coming soon'}`
  : `Screen · ${props.d.name} — ${cur.value.title}`)
const stageBg = computed(() => props.arch
  ? 'repeating-linear-gradient(0deg, var(--line) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, var(--line) 0 1px, transparent 1px 24px), var(--card)'
  : props.d.stage)
// archify's output takes `?embed=1` (chrome off, body sized to the frame) and
// `?theme=` (follows the site; SysScreen keys layers on src, so a theme change
// swaps layers). Undocumented template parameters of archify 2.16.0 — see
// CLAUDE.md § Architecture maps. No `.sy` in that output: body is the target.
const src = computed(() => props.arch
  ? (props.archSrc ? `${props.archSrc}?embed=1&theme=${props.dark ? 'dark' : 'light'}` : '')
  : (props.screen?.src ?? ''))
const target = computed(() => props.arch ? 0 : (props.screen?.t ?? 0))
// archify's body colours, so the contain letterbox reads as part of the map.
const archBg = computed(() => props.dark ? '#020617' : '#f8fafc')

// `?embed=1` hides archify's own zoom nav and it has no wheel listener, so
// these buttons are the only way to zoom; drag-pan works once zoomed in.
const shot = ref<InstanceType<typeof SysScreen> | null>(null)
interface ArchifyWindow extends Window { Archify?: { view?: { zoomIn(): void; zoomOut(): void; reset(): void } } }
function zoom(op: 'zoomIn' | 'zoomOut' | 'reset') {
  const win = shot.value?.frame()?.contentWindow as ArchifyWindow | null | undefined
  win?.Archify?.view?.[op]()
}
</script>

<template>
  <div class="dossier">
    <div class="side">
      <button type="button" class="back" @click="emit('close')">← Overview</button>
      <div class="serial"><span class="sq" :style="{ background: d.acc }"></span>{{ d.serial }} · {{ d.group }}</div>
      <div class="name">{{ d.name }}</div>
      <div class="tag">{{ d.tag }}</div>
      <div class="blurb">{{ d.blurb }}</div>
      <div class="seg">
        <button type="button" :class="{ on: !arch }" @click="emit('showFeat')">Core features</button>
        <button type="button" :class="{ on: arch }" @click="emit('showArch')">Archify HLA</button>
      </div>
      <div class="list">
        <div v-for="(f, i) in feats" :key="f.title" class="item" :class="{ on: i === slide && !arch }"
          :style="i === slide && !arch ? { borderLeftColor: d.acc } : undefined" @click="emit('go', i)">
          <span class="n">{{ pad(i + 1) }}</span>
          <div>
            <div class="t">{{ f.title }}</div>
            <div v-if="i === slide && !arch" class="text">{{ f.explainer || f.line }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="stage" :style="{ background: stageBg }" @touchstart.passive="emit('touchStart', $event)" @touchend.passive="emit('touchEnd', $event)">
        <div class="label">{{ label }}</div>
        <div class="shot">
          <SysScreen ref="shot" :src="src" :target="target" :dir="dir" :fit="arch ? 'contain' : 'cover'" :bg="archBg" :preload="arch ? '' : preload" :interactive="arch" />
        </div>
        <div v-if="arch && archSrc" class="zoom">
          <button type="button" aria-label="Zoom out" @click="zoom('zoomOut')">−</button>
          <button type="button" aria-label="Reset zoom" @click="zoom('reset')">⟲</button>
          <button type="button" aria-label="Zoom in" @click="zoom('zoomIn')">+</button>
        </div>
        <div class="tick tl" :style="{ borderColor: d.acc }"></div>
        <div class="tick br" :style="{ borderColor: d.acc }"></div>
        <div class="idx">{{ d.serial }} / {{ idx }}</div>
        <a v-if="arch && archSrc" :href="archSrc" target="_blank" rel="noopener" class="full">Open full map ↗</a>
      </div>
      <div v-if="!arch" class="ctrls">
        <button type="button" aria-label="Previous" @click="emit('step', -1)">‹</button>
        <div class="dots">
          <button v-for="(f, i) in feats" :key="f.title" type="button" :aria-label="f.title"
            :style="{ width: i === slide ? '28px' : '8px', background: i === slide ? d.acc : 'var(--line)' }" @click="emit('go', i)"></button>
        </div>
        <button type="button" aria-label="Next" @click="emit('step', 1)">›</button>
      </div>
    </div>

    <div class="meta">
      <div class="box"><span class="k">Language</span><span class="v">{{ d.lang }}</span></div>
      <div class="box"><span class="k">Surfaces</span><span class="v">{{ d.surfaces }}</span></div>
      <div class="box"><span class="k">Design</span><span class="v">{{ d.design }}</span></div>
    </div>
  </div>
</template>

<style scoped>
.dossier { display: grid; grid-template-columns: minmax(260px, 380px) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr) auto; gap: 16px clamp(24px, 3vw, 44px); height: 716px; padding: 8px clamp(20px, 4vw, 56px) 0; }
.side { min-height: 0; display: flex; flex-direction: column; overflow-y: auto; padding-bottom: 20px; mask-image: linear-gradient(180deg, #000 calc(100% - 28px), transparent); -webkit-mask-image: linear-gradient(180deg, #000 calc(100% - 28px), transparent); }
.back { align-self: flex-start; padding: 0; border: none; background: none; color: var(--mut); font: 500 12px 'Geist Mono'; letter-spacing: .1em; text-transform: uppercase; cursor: pointer; }
.serial { margin-top: 20px; display: flex; align-items: center; gap: 10px; font: 500 12px 'Geist Mono'; letter-spacing: .12em; text-transform: uppercase; color: var(--mut); }
.sq { width: 10px; height: 10px; }
.name { margin-top: 10px; font: 800 clamp(44px, 4.6vw, 66px)/.95 'Bricolage Grotesque'; letter-spacing: -.04em; }
.tag { margin-top: 12px; font: 600 19px/1.3 'Bricolage Grotesque'; }
.blurb { margin-top: 10px; font: 400 15px/1.55 'Geist'; color: var(--mut); text-wrap: pretty; }
.seg { margin-top: 20px; display: flex; gap: 3px; padding: 3px; border-radius: 4px; background: var(--chip); }
.seg button { flex: 1; padding: 9px 12px; border-radius: 3px; border: none; background: transparent; color: var(--fg); font: 600 13px 'Geist'; cursor: pointer; }
.seg button.on { background: var(--fg); color: var(--bg); }
.list { margin-top: 12px; display: flex; flex-direction: column; }
.item { display: grid; grid-template-columns: 30px 1fr; gap: 10px; padding: 11px 12px; border-left: 2px solid var(--line); background: transparent; cursor: pointer; transition: background .2s; }
.item.on { background: var(--chip); }
.n { font: 500 12px 'Geist Mono'; color: var(--mut); padding-top: 2px; }
.t { font: 600 15px 'Geist'; }
.text { margin-top: 5px; font: 400 14px/1.55 'Geist'; color: var(--mut); text-wrap: pretty; }
.main { min-height: 0; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.stage { position: relative; flex: 1; min-height: 0; border: 1px solid var(--line); border-radius: 4px; }
.label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center; font: 500 12px 'Geist Mono'; letter-spacing: .12em; text-transform: uppercase; color: var(--mut); }
/* isolation: SysScreen z-indexes its layers; without a stacking context here they would sit over .zoom, .idx and .full. */
.shot { position: absolute; inset: 0; overflow: hidden; border-radius: 3px; isolation: isolate; }
.tick { position: absolute; width: 20px; height: 20px; pointer-events: none; }
.tl { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
.br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }
.idx { position: absolute; left: 12px; bottom: 12px; padding: 4px 8px; border-radius: 3px; background: var(--card); font: 500 11px 'Geist Mono'; color: var(--mut); pointer-events: none; }
.zoom { position: absolute; right: 12px; top: 12px; display: flex; gap: 3px; padding: 3px; border-radius: 3px; background: var(--card); border: 1px solid var(--line); }
.zoom button { width: 28px; height: 28px; border: none; border-radius: 2px; background: transparent; color: var(--fg); font: 500 15px/1 'Geist'; cursor: pointer; }
.zoom button:hover { background: var(--chip); }
.full { position: absolute; right: 12px; bottom: 12px; padding: 6px 11px; border-radius: 3px; background: var(--card); border: 1px solid var(--line); font: 500 12px 'Geist'; color: var(--fg); }
.ctrls { display: flex; align-items: center; gap: 14px; }
.ctrls > button { width: 38px; height: 38px; border-radius: 3px; border: 1px solid var(--line); background: transparent; color: var(--fg); font: 500 18px 'Geist'; cursor: pointer; }
.dots { flex: 1; display: flex; justify-content: center; gap: 8px; }
.dots button { height: 6px; border-radius: 2px; border: none; padding: 0; cursor: pointer; transition: width .3s, background .3s; }
.meta { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.box { padding: 10px 14px; border: 1px solid var(--line); border-radius: 3px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.k { font: 500 10px 'Geist Mono'; letter-spacing: .12em; text-transform: uppercase; color: var(--mut); }
.v { font: 500 14px 'Geist'; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

@media (max-width: 900px) {
  .dossier { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; height: auto; }
  .side { overflow: visible; mask-image: none; -webkit-mask-image: none; }
  .stage { aspect-ratio: 16 / 10; flex: none; }
  .meta { grid-template-columns: minmax(0, 1fr); }
}
</style>
