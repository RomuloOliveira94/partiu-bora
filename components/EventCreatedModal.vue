<template>
  <UModal
    :model-value="eventCreated"
    @update:model-value="updateEventCreated"
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
            class="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Evento criado com sucesso!
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
        <div class="grid gap-4 p-4 rounded-md mb-6">
          <NuxtImg
            :src="eventCreatedData.imageUrl || images[0]"
            :alt="eventCreatedData.nome"
            class="rounded-md w-full object-cover h-64"
          />
          <div>
            <p class="mt-1.5">
              O evento <strong>{{ eventCreatedData.nome }}</strong> foi criado
              com sucesso!
            </p>
            <p class="mt-1.5">
              Data:
              <strong>{{ formatDateTime(eventCreatedData.data) }}</strong>
            </p>
            <p class="mt-1.5">
              Registrante:
              <strong>{{ eventCreatedData.registranteNome }}</strong>
            </p>
            <p class="mt-1.5">
              WhatsApp:
              <strong>{{ eventCreatedData.registranteWhatsApp }}</strong>
            </p>
            <p class="mt-1.5">
              Quantidade máxima de convidados:
              <strong>{{ eventCreatedData.quantidadeMaxima }}</strong>
            </p>
          </div>
        </div>

        <div class="grid gap-2">
          <h2 class="font-bold text-xl mb-2">Links para compartilhamento:</h2>
          <div class="grid gap-4">
            <UCard>
              <h3>Código do evento para convidados:</h3>
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                class="my-2 flex items-center justify-between"
                @click="handleCopy(eventCreatedData.linkPublico)"
              >
                <strong>{{ eventCreatedData.linkPublico }}</strong>
                <UIcon
                  name="i-heroicons-clipboard-20-solid"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
              <h3>Link para o evento (copiar):</h3>
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                class="w-64 min-[475px]:w-full mt-2 flex items-center justify-between"
                @click="
                  handleCopy(eventLink(appUrl, eventCreatedData.linkPublico))
                "
              >
                <p class="truncate">
                  <strong>
                    {{ eventLink(appUrl, eventCreatedData.linkPublico) }}
                  </strong>
                </p>
                <UIcon
                  name="i-heroicons-clipboard-20-solid"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
            </UCard>
            <UCard>
              <h3>Código do evento para Administrar:</h3>
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                class="my-2 flex items-center justify-between"
                @click="handleCopy(eventCreatedData.linkPublico)"
              >
                <strong>{{ eventCreatedData.linkPublico }}</strong>
                <UIcon
                  name="i-heroicons-clipboard-20-solid"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
              <h2>Link para o evento (copiar):</h2>
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                class="w-64 min-[475px]:w-full mt-2 flex items-center justify-between"
                @click="
                  handleCopy(adminEventLink(appUrl, eventCreatedData.linkAdmin))
                "
              >
                <p class="truncate">
                  <strong>
                    {{ adminEventLink(appUrl, eventCreatedData.linkAdmin) }}
                  </strong>
                </p>
                <UIcon
                  name="i-heroicons-clipboard-20-solid"
                  class="w-4 h-4 ml-1"
                />
              </UButton>
            </UCard>
            <UCard>
              <template #header>
                <h3 class="text-xl font-semibold">
                  Compartilhar nas redes sociais:
                </h3>
              </template>
              <div class="flex items-center flex-wrap gap-4">
                <UButton
                  variant="outline"
                  color="primary"
                  icon="logos:whatsapp-icon"
                  @click="
                    handleGoTo(
                      'https://api.whatsapp.com/send?text=' +
                        eventInviteText(
                          eventCreatedData.nome,
                          eventCreatedData.data,
                          eventLink(appUrl, eventCreatedData.linkPublico)
                        )
                    )
                  "
                >
                  WhatsApp
                </UButton>
                <UButton
                  variant="outline"
                  color="primary"
                  icon="logos:telegram"
                  @click="
                    handleGoTo(
                      'https://t.me/share/url?url=' +
                        eventInviteText(
                          eventCreatedData.nome,
                          eventCreatedData.data,
                          eventLink(appUrl, eventCreatedData.linkPublico)
                        )
                    )
                  "
                >
                  Telegram
                </UButton>
                <UButton
                  variant="outline"
                  color="primary"
                  icon="logos:facebook"
                  @click="
                    handleGoTo(
                      'https://www.facebook.com/sharer/sharer.php?u=' +
                        eventInviteText(
                          eventCreatedData.nome,
                          eventCreatedData.data,
                          eventLink(appUrl, eventCreatedData.linkPublico)
                        )
                    )
                  "
                >
                  Facebook
                </UButton>
                <UButton
                  variant="outline"
                  color="primary"
                  icon="logos:bluesky"
                  @click="
                    handleGoTo(
                      'https://bsky.app/intent/compose?text=' +
                        eventInviteText(
                          eventCreatedData.nome,
                          eventCreatedData.data,
                          eventLink(appUrl, eventCreatedData.linkPublico)
                        )
                    )
                  "
                >
                  Bluesky
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
  import type { Evento } from "~/server/db/schema";
  import {
    adminEventLink,
    eventLink,
    formatDateTime,
    handleCopy,
    handleGoTo,
  } from "~/helpers";
  import { eventInviteText, images } from "~/helpers/static";

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
