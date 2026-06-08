interface MyEvent {
  adminId: string
  publicId: string
  nome: string
  data: number // Unix timestamp
}

export function useMyEvents() {
  const STORAGE_KEY = 'partiu-bora-my-events'

  const events = useState<MyEvent[]>(STORAGE_KEY, () => [])

  // Load from localStorage on client mount
  onMounted(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) events.value = JSON.parse(stored)
    } catch {
      events.value = []
    }
  })

  // Auto-save to localStorage whenever events change
  watch(events, (val) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
      } catch {
        // localStorage full or unavailable — silently ignore
      }
    }
  }, { deep: true })

  function addEvent(event: MyEvent) {
    // Avoid duplicates — if adminId already exists, skip
    const exists = events.value.some(e => e.adminId === event.adminId)
    if (!exists) events.value.push(event)
  }

  const hasEvents = computed(() => events.value.length > 0)

  return { events, addEvent, hasEvents }
}
