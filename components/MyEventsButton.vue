<template>
  <ClientOnly>
    <div v-if="hasEvents">
      <UButton
        color="white"
        size="lg"
        icon="i-heroicons-calendar-days-20-solid"
        class="rounded px-3 py-3 text-sm font-medium transition focus:outline-none focus:ring"
        @click="open = true"
      >
        Meus Eventos
      </UButton>

      <UModal v-model="open">
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold">Meus Eventos</h2>
          </template>
          <div class="grid gap-2 max-h-96 overflow-y-auto">
            <div v-if="events.length === 0" class="text-gray-500">
              Nenhum evento criado ainda.
            </div>
            <UButton
              v-for="ev in events"
              :key="ev.adminId"
              color="white"
              variant="ghost"
              class="w-full justify-between text-left px-4 py-3"
              @click="goToAdmin(ev.adminId)"
            >
              <span class="font-semibold truncate">{{ ev.nome }}</span>
              <span class="text-sm text-gray-500 ml-2 shrink-0">{{ formatDateTime(ev.data) }}</span>
            </UButton>
          </div>
        </UCard>
      </UModal>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { formatDateTime } from '~/helpers'

const { events, hasEvents } = useMyEvents()
const router = useRouter()
const open = ref(false)

function goToAdmin(adminId: string) {
  open.value = false
  router.push(`/evento/admin/${adminId}`)
}
</script>
