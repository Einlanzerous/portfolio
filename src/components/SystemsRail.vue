<script setup lang="ts">
import type { Projected } from '../composables/useStage'
import type { Cat } from '../data/systems'

defineProps<{
  tiles: Projected[]
  filters: { label: Cat; count: number; on: boolean }[]
  sel: number
  open: boolean
}>()
const emit = defineEmits<{ select: [i: number]; filter: [c: Cat]; rail: [sign: 1 | -1]; wheel: [e: WheelEvent] }>()
const railEl = defineModel<HTMLElement | null>('rail')
</script>

<template>
  <section class="rail" :class="{ open }">
    <div class="bar">
      <span class="h">Systems</span>
      <div class="chips">
        <button v-for="c in filters" :key="c.label" type="button" :class="{ on: c.on }" @click="emit('filter', c.label)">
          {{ c.label }}<span class="count">{{ c.count }}</span>
        </button>
      </div>
      <div class="sp"></div>
      <div class="arrows">
        <button type="button" aria-label="Scroll systems left" @click="emit('rail', -1)">‹</button>
        <button type="button" aria-label="Scroll systems right" @click="emit('rail', 1)">›</button>
      </div>
    </div>
    <div :ref="el => (railEl = el as HTMLElement | null)" class="tiles" @wheel="emit('wheel', $event)">
      <div v-for="t in tiles" :key="t.slug" class="tile" :style="{ background: t.tileArt, outlineColor: t.index === sel ? t.acc : 'transparent', opacity: t.pending ? .62 : 1 }" @click="emit('select', t.index)">
        <div class="serial">{{ t.serial }}</div>
        <div v-if="t.pending" class="dev">In dev</div>
        <div class="foot">
          <div class="nm">{{ t.name }}</div>
          <div v-if="!open" class="tg">{{ t.tag }}</div>
        </div>
      </div>
    </div>
    <slot />
  </section>
</template>

<style scoped>
.rail { flex: 1; background: var(--rail); padding: 6px 0 0; }
.bar { padding: 0 clamp(20px, 4vw, 56px); display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
.h { font: 700 22px 'Bricolage Grotesque'; letter-spacing: -.01em; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { display: flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 3px; border: 1px solid var(--line); background: transparent; color: var(--fg); font: 500 13px 'Geist'; cursor: pointer; }
.chips button.on { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.count { font: 500 11px 'Geist Mono'; opacity: .65; }
.sp { flex: 1; }
.arrows { display: flex; gap: 6px; }
.arrows button { width: 34px; height: 34px; border-radius: 3px; border: 1px solid var(--line); background: transparent; color: var(--fg); font: 500 17px 'Geist'; cursor: pointer; }
.tiles { margin-top: 14px; display: flex; gap: 14px; overflow-x: auto; scroll-behavior: smooth; padding: 6px clamp(20px, 4vw, 56px) 26px; }
.tile { flex: none; width: 300px; height: 170px; border-radius: 6px; position: relative; cursor: pointer; outline: 2px solid transparent; outline-offset: 3px; transition: filter .2s, outline-color .3s, width .35s, height .35s; }
.tile:hover { filter: brightness(1.18); }
.open .tile { width: 210px; height: 118px; }
.serial { position: absolute; top: 10px; left: 12px; font: 500 10px 'Geist Mono'; letter-spacing: .1em; color: var(--mut); }
.dev { position: absolute; top: 8px; right: 8px; padding: 3px 7px; border-radius: 3px; background: var(--chip); font: 500 10px 'Geist Mono'; letter-spacing: .1em; text-transform: uppercase; color: var(--mut); }
.foot { position: absolute; left: 14px; right: 14px; bottom: 12px; }
.nm { font-family: 'Bricolage Grotesque'; font-weight: 800; font-size: 26px; line-height: 1; letter-spacing: -.02em; transition: font-size .35s; }
.open .nm { font-size: 19px; }
.tg { margin-top: 6px; font: 400 13px 'Geist'; color: var(--mut); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
