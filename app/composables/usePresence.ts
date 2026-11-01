export interface PresenceStats {
  visits: number
  online: number
}

export const usePresence = () => {
  const config = useRuntimeConfig()
  const visits = ref<number | null>(null)
  const online = ref<number | null>(null)
  const available = computed(() => visits.value !== null && online.value !== null)

  const ping = async () => {
    const endpoint = `${config.app.baseURL.replace(/\/?$/, '/')}presence.php`
    try {
      const data = await $fetch<PresenceStats>(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      })
      if (typeof data?.visits === 'number' && typeof data?.online === 'number') {
        visits.value = data.visits
        online.value = Math.max(1, data.online)
      }
    } catch {
    }
  }

  onMounted(() => {
    void ping()
    const timer = window.setInterval(() => { void ping() }, 25000)
    onBeforeUnmount(() => window.clearInterval(timer))
  })

  return { visits, online, available }
}
