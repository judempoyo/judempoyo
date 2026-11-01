<script setup lang="ts">
const { t, n } = useI18n()
const { openTerminal } = useTerminal()
const { visits, online, available } = usePresence()
</script>

<template>
  <footer class="site-footer shell">
    <span class="footer-signature">Jude Mpoyo<span class="accent">.</span></span>
    <span class="annotation">Kolwezi, {{ t('design.country') }} · UTC+2</span>
    <p v-if="available" class="presence-line annotation" aria-live="polite">
      <span>{{ t('presence.visits', { n: n(visits || 0) }) }}</span>
      <span class="presence-dot" aria-hidden="true"></span>
      <span>{{ t('presence.online', { n: n(online || 0) }) }}</span>
    </p>
    <button type="button" class="text-link" @click="openTerminal"><span aria-hidden="true">&gt;_</span> {{
      t('terminal.open') }}</button>
    <a href="https://github.com/judempoyo" target="_blank" rel="noopener noreferrer" class="text-link">GitHub ↗</a>
  </footer>
</template>
