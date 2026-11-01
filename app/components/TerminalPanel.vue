<script setup lang="ts">
import type { TerminalEntry } from '~/composables/useTerminal'

const { t, locale, setLocale } = useI18n()
const { closeTerminal, terminalMinimized, terminalExpanded, terminalHistory, commandHistory } = useTerminal()
const { projects } = useProjects()
const { groups: toolGroups } = useToolGroups()
const contact = useContactLinks()
const localePath = useLocalePath()
const colorMode = useColorMode()
const windowRef = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const output = ref<HTMLElement | null>(null)
const dock = ref<HTMLButtonElement | null>(null)
const command = ref('')
const dragging = ref(false)
const position = reactive({ x: 24, y: 100 })
const commandIndex = ref(-1)
const commands = ['help', 'whoami', 'about', 'projects', 'project smartcyberspace', 'project uzaraka', 'project miabi', 'project goposta', 'project laraapistarter', 'tools', 'go', 'contact', 'github', 'linkedin', 'whatsapp', 'open work', 'open tools', 'open about', 'open contact', 'theme light', 'theme dark', 'theme system', 'lang en', 'lang fr', 'services', 'proofs', 'incident tls', 'location', 'search vue', 'search docker', 'readme', 'shortcuts', 'date', 'pwd', 'ls', 'stack', 'history', 'clear', 'minimize', 'maximize', 'exit']
const projectAliases: Record<string, string> = { smart: 'smartcyberspace', cyberspace: 'smartcyberspace', lara: 'laraapistarter', posta: 'goposta' }
const suggestions = computed(() => {
  const value = command.value.trim().toLowerCase()
  return value ? commands.filter(item => item.startsWith(value) && item !== value).slice(0, 4) : []
})
const windowStyle = computed(() => terminalExpanded.value
  ? { transform: 'translate3d(12px, 12px, 0)' }
  : { transform: `translate3d(${position.x}px, ${position.y}px, 0)` })
let previousFocus: HTMLElement | null = null
let dragOrigin: { pointerX: number; pointerY: number; x: number; y: number } | undefined

const clampPosition = () => {
  const rect = windowRef.value?.getBoundingClientRect()
  position.x = Math.max(8, Math.min(position.x, window.innerWidth - (rect?.width || 320) - 8))
  position.y = Math.max(8, Math.min(position.y, window.innerHeight - Math.min(rect?.height || 400, window.innerHeight - 16) - 8))
}
const focusInput = async () => { await nextTick(); input.value?.focus() }
const restore = () => { terminalMinimized.value = false; void focusInput() }
const minimize = async () => {
  terminalMinimized.value = true
  await nextTick()
  dock.value?.focus()
}
const toggleExpanded = async () => {
  terminalExpanded.value = !terminalExpanded.value
  await nextTick()
  if (!terminalExpanded.value) clampPosition()
}
const close = () => {
  closeTerminal()
  if (previousFocus?.isConnected) previousFocus.focus()
  else document.querySelector<HTMLButtonElement>('.terminal-trigger')?.focus()
}

const startDrag = (event: PointerEvent) => {
  if (terminalExpanded.value || event.button !== 0) return
  if ((event.target as HTMLElement).closest('.window-controls')) return
  dragOrigin = { pointerX: event.clientX, pointerY: event.clientY, ...position }
  dragging.value = true
    ; (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}
const moveDrag = (event: PointerEvent) => {
  if (!dragOrigin) return
  position.x = dragOrigin.x + event.clientX - dragOrigin.pointerX
  position.y = dragOrigin.y + event.clientY - dragOrigin.pointerY
  clampPosition()
}
const stopDrag = () => { dragOrigin = undefined; dragging.value = false }
const moveWithKeyboard = (event: KeyboardEvent) => {
  if (terminalExpanded.value || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
  event.preventDefault()
  const step = event.shiftKey ? 48 : 16
  if (event.key === 'ArrowLeft') position.x -= step
  if (event.key === 'ArrowRight') position.x += step
  if (event.key === 'ArrowUp') position.y -= step
  if (event.key === 'ArrowDown') position.y += step
  clampPosition()
}
const browseHistory = (direction: number) => {
  if (!commandHistory.value.length) return
  commandIndex.value = Math.max(0, Math.min(commandHistory.value.length, commandIndex.value + direction))
  command.value = commandHistory.value[commandIndex.value] || ''
}
const complete = (event: KeyboardEvent) => {
  if (!suggestions.value.length) return
  event.preventDefault()
  command.value = suggestions.value[0]!
}
const sectionLinks: Record<string, string> = { work: 'projects', projects: 'projects', tools: 'tools', about: 'about', contact: 'contact', go: 'golang' }
const visit = async (section: string) => {
  terminalMinimized.value = true
  await navigateTo(localePath('/') + `#${sectionLinks[section] || section}`)
}

const run = async (value = command.value) => {
  const entered = value.trim().slice(0, 160)
  if (!entered) return
  command.value = ''
  const normalized = entered.toLowerCase()
  commandHistory.value.push(entered)
  if (commandHistory.value.length > 80) commandHistory.value.shift()
  commandIndex.value = commandHistory.value.length
  if (normalized === 'exit') return close()
  if (normalized === 'minimize') return minimize()
  if (normalized === 'maximize') return toggleExpanded()
  if (normalized === 'clear') { terminalHistory.value = []; await focusInput(); return }
  const entry: TerminalEntry = { command: entered, text: '' }
  const [name, argument] = normalized.split(/\s+/)
  const query = normalized.slice((name?.length || 0) + 1).trim()
  if (name === 'open' && argument && sectionLinks[argument]) {
    entry.text = t('terminal.opening')
    terminalHistory.value.push(entry)
    return visit(argument)
  }
  if (name === 'theme' && ['light', 'dark', 'system'].includes(argument || '')) {
    colorMode.preference = argument!
    entry.text = `${t('terminal.theme_set')} ${argument}`
  } else if (name === 'lang' && (argument === 'en' || argument === 'fr')) {
    entry.text = `${t('terminal.language_set')} ${argument.toUpperCase()}`
    await setLocale(argument)
  } else if (name === 'project' && argument) {
    const project = projects.value.find(item => item.id === argument || item.id === projectAliases[argument || ''])
    if (project) {
      entry.text = `${t(project.titleKey)}\n\n${t(project.descriptionKey)}\n\n${t(project.roleKey)}\n\n${t(project.resultKey)}`
      const href = project.isLive ? project.liveUrl : project.docsUrl
      if (href) entry.links = [{ label: t(project.isLive ? 'projects.cta_live' : 'projects.cta_docs'), href }]
    } else entry.text = t('terminal.unknown')
  } else if (normalized === 'pwd') {
    entry.text = '~/portfolio'
  } else if (['about', 'whoami'].includes(normalized)) {
    entry.text = `Jude Mpoyo / Kolwezi, ${t('design.country')}\n\n${t('about.bio_1')}\n\n${t('about.bio_2')}`
  } else if (['tools', 'stack', 'skills'].includes(normalized)) {
    entry.text = toolGroups.map(group => `${t(`tools.categories.${group.id}`)}\n${group.tools.map(tool => `${tool.name}${tool.learning ? ` — ${t('tools.learning')}` : ''}`).join(' · ')}`).join('\n\n')
    entry.links = toolGroups.flatMap(group => group.tools.filter(tool => tool.href).map(tool => ({ label: tool.name, href: tool.href! })))
  } else if (normalized === 'proofs') {
    entry.text = t('terminal.proofs')
    entry.links = projects.value.flatMap(project => (project.contributions || []).map(item => ({ label: `${t(project.titleKey)} — ${t(item.descriptionKey)}`, href: item.url })))
  } else if (normalized === 'incident tls' || normalized === 'incident') {
    entry.text = ['symptom', 'intervention', 'result'].map(step => `${t(`design.incident.${step}.title`)}\n${t(`design.incident.${step}.body`)}`).join('\n\n') + `\n\n${t('design.incident_caveat')}`
  } else if (normalized === 'location' || normalized === 'date') {
    entry.text = `Kolwezi, ${t('design.country')} / UTC+2\n${new Intl.DateTimeFormat(locale.value, { timeZone: 'Africa/Lubumbashi', dateStyle: 'full', timeStyle: 'short' }).format(new Date())}`
  } else if (name === 'search' && query) {
    const matches = projects.value.filter(project => [t(project.titleKey), t(project.descriptionKey), t(project.roleKey), ...project.stack].join(' ').toLowerCase().includes(query))
    entry.text = matches.length ? matches.map(project => `${t(project.titleKey)} — ${t(project.descriptionKey)}`).join('\n\n') : t('terminal.no_results')
    entry.links = matches.map(project => ({ label: t(project.titleKey), href: localePath('/') + `#project-${project.id}` }))
  } else if (['services', 'readme', 'shortcuts'].includes(normalized)) {
    entry.text = t(`terminal.${normalized}`)
  } else if (normalized === 'history') {
    entry.text = commandHistory.value.join('\n')
  } else if (['contact', 'github', 'linkedin', 'whatsapp'].includes(normalized)) {
    entry.text = t('terminal.contact')
    const links = [
      { label: 'Email', href: contact.email },
      { label: 'GitHub', href: contact.github },
      { label: 'LinkedIn', href: contact.linkedin },
      ...(contact.whatsapp.value ? [{ label: 'WhatsApp', href: contact.whatsapp.value }] : []),
    ]
    entry.links = normalized === 'contact' ? links : links.filter(link => link.label.toLowerCase() === normalized)
    if (normalized === 'whatsapp' && !contact.whatsapp.value) entry.text = t('terminal.whatsapp_pending')
  } else if (normalized === 'projects' || normalized === 'ls') {
    entry.text = t('terminal.projects')
    entry.links = projects.value.map(project => ({ label: t(project.titleKey), href: localePath('/') + `#project-${project.id}` }))
  } else if (normalized === 'help' || normalized === 'go') entry.text = t(`terminal.${normalized}`)
  else entry.text = t('terminal.unknown')
  terminalHistory.value.push(entry)
  if (terminalHistory.value.length > 50) terminalHistory.value.shift()
  await nextTick()
  output.value?.scrollTo({ top: output.value.scrollHeight })
  await focusInput()
}

onMounted(() => {
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  position.x = Math.max(8, window.innerWidth - 764)
  position.y = Math.max(88, Math.min(140, window.innerHeight - 580))
  clampPosition()
  commandIndex.value = commandHistory.value.length
  window.addEventListener('resize', clampPosition)
  void focusInput()
})
onBeforeUnmount(() => window.removeEventListener('resize', clampPosition))
</script>

<template>
  <section v-show="!terminalMinimized" ref="windowRef" role="dialog" aria-modal="false" aria-labelledby="terminal-title"
    class="terminal-window" :class="{ 'is-expanded': terminalExpanded, 'is-dragging': dragging }" :style="windowStyle"
    @keydown.esc.stop="close">
    <div class="terminal-bar" @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="stopDrag"
      @pointercancel="stopDrag" @lostpointercapture="stopDrag">
      <button type="button" class="window-grip" :aria-label="t('terminal.move')" @keydown="moveWithKeyboard"><span
          aria-hidden="true">⠿</span></button>
      <div class="terminal-heading">
        <h2 id="terminal-title">jude@kolwezi <span>~/portfolio</span></h2><span class="terminal-caption">{{
          t('terminal.window_hint') }}</span>
      </div>
      <div class="window-controls">
        <button type="button" :title="t('terminal.minimize')" :aria-label="t('terminal.minimize')"
          @click="minimize">−</button>
        <button type="button" :title="t(terminalExpanded ? 'terminal.restore' : 'terminal.maximize')"
          :aria-label="t(terminalExpanded ? 'terminal.restore' : 'terminal.maximize')" @click="toggleExpanded"><span
            aria-hidden="true">{{ terminalExpanded ? '▣' : '□' }}</span></button>
        <button type="button" class="window-close" :title="t('design.close')" :aria-label="t('design.close')"
          @click="close">×</button>
      </div>
    </div>
    <div class="terminal-workspace">
      <aside class="terminal-sidebar" :aria-label="t('terminal.explorer')">
        <span class="annotation">{{ t('terminal.explorer') }}</span>
        <button v-for="item in ['about', 'projects', 'proofs', 'tools', 'go', 'services', 'contact']" :key="item"
          type="button" @click="run(item)"><span aria-hidden="true">↳</span>{{ item }}<span
            class="terminal-file-extension">.log</span></button>
        <div class="terminal-sidebar-footer">Kolwezi / UTC+2<br />Laravel · Vue · Go</div>
      </aside>
      <div class="terminal-main">
        <div ref="output" class="terminal-output" role="log" aria-live="polite" aria-relevant="additions">
          <div class="terminal-intro"><span class="terminal-monogram" aria-hidden="true">jm.</span>
            <div><strong>{{ t('terminal.intro_title') }}</strong>
              <p>{{ t('terminal.welcome') }}</p>
            </div>
          </div>
          <div class="terminal-quick-actions"><button v-for="item in ['help', 'projects', 'go', 'contact']" :key="item"
              type="button" @click="run(item)">{{ item }} <span aria-hidden="true">↵</span></button></div>
          <div v-for="(entry, index) in terminalHistory" :key="index" class="terminal-entry">
            <p><span class="terminal-prompt">~/portfolio $</span> {{ entry.command }}</p>
            <p class="terminal-answer">{{ entry.text }}</p>
            <div v-if="entry.links?.length" class="terminal-result-links">
              <NuxtLink v-for="link in entry.links" :key="link.href" :to="link.href"
                @click="link.href.startsWith('/') && (terminalMinimized = true)"
                :target="link.href.startsWith('https:') ? '_blank' : undefined" rel="noopener noreferrer">{{ link.label
                }} ↗</NuxtLink>
            </div>
          </div>
        </div>
        <div v-if="suggestions.length" class="terminal-completions"><button v-for="suggestion in suggestions"
            :key="suggestion" type="button" @click="command = suggestion; focusInput()">{{ suggestion
            }}</button><span>Tab ↹</span></div>
        <form class="terminal-form" @submit.prevent="run()"><label for="terminal-command" class="terminal-prompt">$
            <span class="sr-only">{{ t('terminal.command') }}</span></label><input id="terminal-command" ref="input"
            v-model="command" :placeholder="t('terminal.placeholder')" autocomplete="off" autocapitalize="off"
            spellcheck="false" maxlength="160" @input="commandIndex = commandHistory.length"
            @keydown.up.prevent="browseHistory(-1)" @keydown.down.prevent="browseHistory(1)" @keydown.tab="complete"
            @keydown.ctrl.l.prevent="terminalHistory = []" /><button type="submit"
            :aria-label="t('terminal.run')">↵</button></form>
      </div>
    </div>
    <div class="terminal-statusbar"><span><span class="terminal-status-dot" aria-hidden="true"></span>{{
      t('terminal.local_session') }}</span><span>↑ ↓ {{ t('terminal.history_label') }} · Tab {{ t('terminal.complete')
        }}</span><span>{{ locale.toUpperCase() }} / {{ colorMode.preference }}</span></div>
  </section>
  <button v-if="terminalMinimized" ref="dock" type="button" class="terminal-dock" @click="restore"><span
      aria-hidden="true">&gt;_</span><span>{{ t('terminal.resume') }}</span><span aria-hidden="true">↗</span></button>
</template>
