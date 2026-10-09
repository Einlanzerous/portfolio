<script setup lang="ts">
import { site } from '../site'
import type { Theme } from '../composables/useStage'

defineProps<{ theme: Theme }>()
const emit = defineEmits<{ cycleTheme: [] }>()
const labels: Record<Theme, string> = { system: '◐ System', light: '○ Light', dark: '● Dark' }
</script>

<template>
  <header class="hd">
    <div class="who">
      <span class="name">{{ site.owner }}</span>
      <span class="role">{{ site.role }}</span>
    </div>
    <nav class="nav">
      <a href="#work" class="on">Work</a>
      <a v-if="site.aboutUrl" :href="site.aboutUrl">About</a>
      <a v-if="site.resumeUrl" :href="site.resumeUrl" target="_blank" rel="noopener">Résumé ↗</a>
    </nav>
    <div class="sp"></div>
    <div class="ctl">
      <a v-if="site.ssoUrl" :href="site.ssoUrl" class="sso"><span class="dot"></span>Sign in with ZGI</a>
      <button type="button" class="theme" title="Theme" @click="emit('cycleTheme')">{{ labels[theme] }}</button>
    </div>
  </header>
</template>

<style scoped>
.hd { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 32px; padding: 22px clamp(20px, 4vw, 56px); }
.who { display: flex; flex-direction: column; gap: 3px; }
.name { font: 800 23px/1 'Bricolage Grotesque'; letter-spacing: -.02em; }
.role { font: 500 13px 'Geist'; color: var(--mut); }
.nav { display: flex; gap: 24px; font: 500 14px 'Geist'; color: var(--mut); }
.nav .on { color: var(--fg); border-bottom: 2px solid var(--acc); padding-bottom: 3px; }
.sp { flex: 1; }
.ctl { display: flex; align-items: center; gap: 8px; }
.sso { display: flex; align-items: center; gap: 9px; padding: 8px 14px; border-radius: 999px; background: var(--chip); font: 500 13px 'Geist'; }
.dot { width: 8px; height: 8px; background: var(--acc); transform: rotate(45deg); }
.theme { padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--fg); font: 500 13px 'Geist'; cursor: pointer; }
</style>
