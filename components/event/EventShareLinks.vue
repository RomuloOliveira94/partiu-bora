<template>
  <UCard
  class="mt-6"
  >
    <div>
      <div class="grid gap-2">
        <h2 class="font-bold text-xl mb-2">Links para compartilhamento:</h2>
        <div class="grid gap-4 xl:flex xl:gap-4">
          <UCard>
            <template #header>
              <h3 class="font-semibold text-xl">
                Links para convidados:
              </h3>
            </template>
            <h3>Código do evento para convidados:</h3>
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              class="my-2 flex items-center justify-between"
              @click="handleCopy(evento.linkPublico)"
            >
              <strong>{{ evento.linkPublico }}</strong>
              <UIcon
                name="i-heroicons-clipboard-20-solid"
                class="w-4 h-4 ml-1"
              />
            </UButton>
            <h3>Link para o evento (copiar):</h3>
            <div class="flex items-center flex-wrap mt-2 md:mt-0 gap-1.5">
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                class="w-52 min-[475px]:w-fit flex items-center justify-between"
                @click="handleCopy(eventLink(appUrl, evento.linkPublico))"
              >
                <p class="truncate">
                  <strong>
                    {{ eventLink(appUrl, evento.linkPublico) }}
                  </strong>
                </p>
                <UIcon
                  name="i-heroicons-clipboard-20-solid"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
              <LinkButton :link="eventLink(appUrl, evento.linkPublico)" />
            </div>
          </UCard>
          <UCard>
            <template #header>
              <h3 class="font-semibold text-xl">
                Links para administradores:
              </h3>
            </template>
            <h3>Código do evento para Administrar:</h3>
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              class="my-2 flex items-center justify-between"
              @click="handleCopy(evento.linkPublico)"
            >
              <strong>{{ evento.linkPublico }}</strong>
              <UIcon
                name="i-heroicons-clipboard-20-solid"
                class="w-4 h-4 ml-1"
              />
            </UButton>
            <h2>Link para o evento (copiar):</h2>
            <div class="flex items-center flex-wrap mt-2 md:mt-0 gap-1.5">
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                class="w-52 min-[475px]:w-fit flex items-center justify-between"
                @click="handleCopy(adminEventLink(appUrl, evento.linkAdmin))"
              >
                <p class="truncate">
                  <strong>
                    {{ adminEventLink(appUrl, evento.linkAdmin) }}
                  </strong>
                </p>
                <UIcon
                  name="i-heroicons-clipboard-20-solid"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
              <LinkButton :link="adminEventLink(appUrl, evento.linkAdmin)" />
            </div>
          </UCard>
          <SocialEventShareCard :evento="evento" :appUrl="appUrl" />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
  import type { Response } from "~/composables/types";
  import { adminEventLink, eventLink, handleCopy } from "~/helpers";
  import type { Evento } from "~/server/db/schema";
  defineProps<{
    evento: Response["evento"] | Evento;
    appUrl: string;
  }>();
</script>

<style scoped></style>
