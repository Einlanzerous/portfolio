<script setup lang="ts">
import { site } from '../site'
const version = __APP_VERSION__
</script>

<template>
  <footer class="ft">
    <span>© 2026 {{ site.owner }}</span><span>{{ site.org }}</span><span class="v">{{ version }}</span>
  </footer>
</template>

<style scoped>
.ft { padding: 4px clamp(20px, 4vw, 56px) 28px; display: flex; flex-wrap: wrap; gap: 8px 24px; font: 500 11px 'Geist Mono'; letter-spacing: .08em; text-transform: uppercase; color: var(--mut); }
.v { margin-left: auto; opacity: .7; }
</style>
