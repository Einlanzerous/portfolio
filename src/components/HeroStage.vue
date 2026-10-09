<script setup lang="ts">
import SysScreen from './SysScreen.vue'
import type { Projected } from '../composables/useStage'
import type { Feature, Screen } from '../data/types'

defineProps<{
  hero: Projected
  feats: Feature[]
  slide: number
  screen: Screen | null
  preload: string
  dir: number
}>()
const emit = defineEmits<{ open: []; openArch: []; go: [i: number]; pause: []; resume: []; touchStart: [e: TouchEvent]; touchEnd: [e: TouchEvent] }>()
const pad = (n: number) => String(n).padStart(2, '0')
function pip(e: Event, i: number) { e.stopPropagation(); emit('go', i) }
</script>

<template>
  <!-- Pause on mousemove, not mouseenter: Chrome fires a synthetic mouseenter when the hero
       renders under a pointer that has not moved (a fresh load with the cursor already over
       the page), which froze the rotation before anyone hovered on purpose. -->
  <div class="hero" :style="{ background: hero.field }" @mousemove="emit('pause')" @mouseleave="emit('resume')" @touchstart.passive="emit('touchStart', $event)" @touchend.passive="emit('touchEnd', $event)">
    <div class="top">
      <div class="copy">
        <div class="serial">{{ hero.serial }} — {{ hero.group }}</div>
        <div class="tag">{{ hero.tag }}</div>
        <div class="blurb">{{ hero.blurb }}</div>
        <div class="cta">
          <button type="button" class="ghost" @click="emit('openArch')">Architecture</button>
          <button type="button" class="solid" @click="emit('open')">Explore Service →</button>
        </div>
      </div>
      <div class="wedgeWrap">
        <div class="wedge" @click="emit('open')">
          <div v-if="!screen" class="soon">Screens · {{ hero.name }} · coming soon</div>
          <div class="shot">
            <SysScreen :src="screen?.src ?? ''" :target="screen?.t ?? 0" :dir="dir" fit="cover" :preload="preload" />
          </div>
          <div class="explore">Explore {{ hero.name }} →</div>
        </div>
      </div>
    </div>
    <div class="grow"></div>
    <div v-if="feats.length > 1" class="pips">
      <span class="num">{{ pad(slide + 1) }} / {{ pad(feats.length) }}</span>
      <span class="cap">{{ feats[slide]?.title }}</span>
      <div class="dots">
        <button v-for="(f, i) in feats" :key="f.title" type="button" :aria-label="f.title"
          :style="{ width: i === slide ? '22px' : '6px', background: i === slide ? '#141311' : 'rgba(20,19,17,.3)' }" @click="pip($event, i)"></button>
      </div>
    </div>
    <div class="nameRow">
      <div class="bigName" :style="{ fontSize: hero.nameSize }">{{ hero.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.hero { position: relative; display: flex; flex-direction: column; height: 730px; overflow: hidden; color: #141311; transition: background .45s; }
.top { display: grid; grid-template-columns: minmax(0, 1fr); padding: clamp(28px, 3.4vw, 48px) clamp(20px, 4vw, 56px) 0; align-items: start; }
.copy { position: relative; z-index: 2; min-width: 0; max-width: min(520px, 36vw); display: flex; flex-direction: column; align-items: flex-start; gap: 14px; }
.serial { font: 500 12px 'Geist Mono'; letter-spacing: .14em; text-transform: uppercase; }
.tag { font: 700 clamp(26px, 2.6vw, 36px)/1.08 'Bricolage Grotesque'; letter-spacing: -.02em; text-wrap: balance; height: 2.16em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.blurb { max-width: 480px; font: 400 16px/1.55 'Geist'; text-wrap: pretty; height: 4.65em; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.cta { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 10px; }
.ghost { padding: 12px 18px; border-radius: 3px; border: 1.5px solid #141311; background: transparent; color: #141311; font: 600 14px 'Geist'; cursor: pointer; }
.solid { padding: 12px 20px; border-radius: 3px; border: 1.5px solid #141311; background: #141311; color: #f3f2ef; font: 600 14px 'Geist'; cursor: pointer; }
.wedgeWrap { position: absolute; top: 0; bottom: 0; left: 36%; right: 0; z-index: 1; filter: drop-shadow(-14px 0 22px rgba(0,0,0,.28)); }
.wedge { position: absolute; inset: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 34% 100%); background: repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1px, transparent 1px 12px), #17171a; cursor: pointer; overflow: hidden; transition: filter .25s; }
.wedge:hover { filter: brightness(1.08); }
.soon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding-left: 30%; font: 500 11px 'Geist Mono'; letter-spacing: .12em; text-transform: uppercase; color: #8d8c87; }
.shot { position: absolute; inset: 0; pointer-events: none; }
.explore { position: absolute; top: 20px; right: clamp(20px, 4vw, 56px); padding: 8px 13px; border-radius: 3px; background: rgba(20,19,17,.82); color: #f3f2ef; font: 600 12px 'Geist'; pointer-events: none; }
.grow { flex: 1; min-height: 32px; }
.pips { position: relative; z-index: 3; display: flex; align-items: center; gap: 14px; padding: 0 clamp(20px, 4vw, 56px); margin-bottom: -6px; color: #141311; }
.num { font: 500 12px 'Geist Mono'; letter-spacing: .06em; white-space: nowrap; }
.cap { font: 600 16px 'Geist'; white-space: nowrap; }
.dots { display: flex; gap: 6px; }
.dots button { height: 6px; border-radius: 2px; border: none; padding: 0; cursor: pointer; transition: width .3s, background .3s; }
.nameRow { position: relative; z-index: 2; flex: none; height: min(226px, 15.7vw); display: flex; align-items: flex-end; pointer-events: none; padding: 0 clamp(16px, 3.4vw, 48px) 8px; overflow: hidden; }
.bigName { font-family: 'Bricolage Grotesque'; font-weight: 800; line-height: 1; letter-spacing: -.05em; white-space: nowrap; }

@media (max-width: 900px) {
  .hero { height: auto; }
  .copy { max-width: none; }
  .tag, .blurb { height: auto; -webkit-line-clamp: unset; display: block; }
  .wedgeWrap { position: relative; left: auto; right: auto; inset: auto; margin-top: 24px; aspect-ratio: 16 / 10; filter: none; }
  .wedge { clip-path: none; border-radius: 4px; }
  .soon { padding-left: 0; }
  .explore { right: 12px; top: 12px; }
  .grow { min-height: 24px; }
  .nameRow { height: auto; padding-top: 16px; }
  .bigName { font-size: clamp(44px, 14vw, 96px) !important; }
}
</style>
