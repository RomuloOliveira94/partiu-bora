<template>
  <div
    class="md:flex md:justify-between md:flex-row md:items-center grid gap-2"
  >
    <div class="grid gap-2">
      <h2
        class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white"
      >
        {{ evento.nome }}
      </h2>
      <div class="flex items-center flex-wrap gap-2">
        <small
          >Criado por: <strong>{{ evento.registranteNome }}</strong></small
        >
        <small class="flex items-center gap-1"
          ><UIcon name="i-logos:whatsapp-icon" class="w-4 h-4" />
          {{ evento.registranteWhatsApp }}</small
        >
      </div>
      <p>
        Data:
        <strong>{{ formatDateTime(evento.data) }}</strong>
      </p>
    </div>
    <NuxtImg
      v-if="evento.imageUrl"
      :src="evento.imageUrl"
      :alt="'Imagem do evento: ' + evento.nome"
      class="rounded-md w-full h-44 md:w-44 md:h-32 object-cover"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Response } from "~/composables/types";
  import { formatDateTime } from "~/helpers";
  import type { Evento } from "~/server/db/schema";

  defineProps<{
    evento: Response["evento"] | Evento;
  }>();
</script>

<style scoped></style>
