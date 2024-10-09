<template>
  <UModal
    :model-value="eventCreated"
    @update:model-value="updateEventCreated"
    fullscreen
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h2
            class="text-2xl md:text-3xl font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Evento criado com sucesso!
            <UIcon name="twemoji:party-popper" class="ml-1" />
          </h2>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="updateEventCreated(false)"
          />
        </div>
      </template>
      <div>
        <EventHeader :evento="eventCreatedData" />
        <div class="grid gap-4">
          <EventShareLinks
            v-if="eventCreatedData"
            :evento="eventCreatedData"
            :appUrl="appUrl"
          />
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
  import type { Evento } from "~/server/db/schema";
  defineProps<{
    eventCreated: boolean;
    eventCreatedData: Evento;
    appUrl: string;
  }>();

  const emit = defineEmits(["update:eventCreated"]);

  const updateEventCreated = (value: boolean) => {
    emit("update:eventCreated", value);
  };
</script>

<style scoped></style>
