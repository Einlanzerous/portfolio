<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from './components/AppHeader.vue'
import HeroStage from './components/HeroStage.vue'
import Dossier from './components/Dossier.vue'
import SystemsRail from './components/SystemsRail.vue'
import AppFooter from './components/AppFooter.vue'
import { useStage } from './composables/useStage'

const st = useStage()
const { s } = st

// The two palettes, verbatim from the design. Dark is the stylesheet default;
// light overrides the custom properties on the root of the page.
const light = {
  '--bg': '#f6f5f2', '--rail': '#e3e2de', '--fg': '#151515', '--mut': '#5a5955',
  '--line': 'rgba(0,0,0,.1)', '--card': '#fcfbf9', '--chip': 'rgba(0,0,0,.06)', '--acc': 'oklch(0.6 0.21 30)',
}
const vars = computed(() => st.dark.value ? {} : light)
</script>

<template>
  <div class="page" :style="vars">
    <AppHeader :theme="s.theme" @cycle-theme="st.cycleTheme" />

    <main id="work" :ref="el => (st.stageEl.value = el as HTMLElement | null)">
      <HeroStage v-if="!s.open" :hero="st.cur.value" :feats="st.feats.value" :slide="st.slide.value" :screen="st.screen.value" :preload="st.preload.value" :dir="s.dir"
        @open="st.openAt(false)" @open-arch="st.openAt(true)" @go="st.goSlide" @pause="st.heroPause" @resume="st.heroResume" @touch-start="st.touchStart" @touch-end="st.touchEnd" />
      <Dossier v-else :d="st.cur.value" :feats="st.feats.value" :slide="st.slide.value" :screen="st.screen.value" :preload="st.preload.value" :dir="s.dir" :arch="s.arch" :arch-src="st.archSrc.value" :dark="st.dark.value"
        @close="st.close" @show-feat="st.showFeat" @show-arch="st.showArch" @go="st.goSlide" @step="st.step" @touch-start="st.touchStart" @touch-end="st.touchEnd" />
    </main>

    <div class="fade"></div>

    <SystemsRail v-model:rail="st.railEl.value" :tiles="st.tiles.value" :filters="st.filters.value" :sel="s.sel" :open="s.open"
      @select="st.select" @filter="st.setFilter" @rail="st.railBy" @wheel="st.railWheel">
      <AppFooter />
    </SystemsRail>
  </div>
</template>

<style scoped>
.page {
  --bg: #0e0e10; --rail: #1c1c1f; --fg: #f3f2ef; --mut: #a3a29d; --line: rgba(255,255,255,.1);
  --card: #161618; --chip: rgba(255,255,255,.08); --acc: oklch(0.68 0.21 30);
  min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); color: var(--fg);
  font-family: 'Geist', sans-serif; transition: background .3s, color .3s;
}
.fade { height: 28px; background: linear-gradient(180deg, var(--bg), var(--rail)); }
</style>
