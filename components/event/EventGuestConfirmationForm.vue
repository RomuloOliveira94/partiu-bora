<template>
  <UCard
    :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }"
  >
    <template #header>
      <h1>Confirmação:</h1>
    </template>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="emit('submit', $event)"
    >
      <div class="flex items-center flex-col gap-4 w-full">
        <UFormGroup label="Seu nome" name="nome" class="w-full">
          <UInput
            v-model="state.nome"
            type="text"
            size="sm"
            icon="i-heroicons-user-circle-16-solid"
            maxlength="18"
            minlength="3"
          />
        </UFormGroup>
        <UFormGroup label="Seu WhatsApp" name="telefone" class="w-full">
          <UInput
            v-model="state.telefone"
            type="tel"
            size="sm"
            icon="i-heroicons-phone"
            v-maska="'(##) #####-####'"
            placeholder="(99) 99999-9999"
            maxlength="15"
            minlength="15"
          />
        </UFormGroup>
        <UFormGroup
          label="Avatar (opcional)"
          name="avatarUrl"
          class="self-start w-fit"
        >
          <UPopover
            :popper="{ arrow: true, placement: 'auto-start' }"
            v-model:open="open"
          >
            <UButton
              color="white"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            >
              <UAvatar
                :src="
                  state.avatarUrl
                    ? state.avatarUrl
                    : state.nome
                    ? `https://ui-avatars.com/api/?name=${state.nome}&background=random`
                    : `https://ui-avatars.com/api/?name=SN&background=random`
                "
                size="lg"
              />
            </UButton>

            <template #panel>
              <div
                class="flex gap-2 p-4 items-center justify-center flex-wrap w-96"
              >
                <div v-for="(item, index) in items" :key="index">
                  <UAvatar
                    :src="item"
                    size="lg"
                    @click="
                      state.avatarUrl = item;
                      open = false;
                    "
                  />
                </div>
                <UButton
                  icon="material-symbols:sync"
                  @click="emit('handleRefreshAvatars')"
                  class="mx-auto w-fit"
                  >Atualiza Avatares</UButton
                >
              </div>
            </template>
          </UPopover>
        </UFormGroup>
      </div>
      <UButton type="submit">Confirmar Presença!</UButton>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
  import type { Response } from "~/composables/types";
  import type { Evento } from "~/server/db/schema";
  import { vMaska } from "maska/vue";
  const open = ref(false);

  defineProps<{
    event: Response["evento"] | Evento;
    appUrl: string;
    state: {
      nome: undefined;
      telefone: undefined;
      avatarUrl: string;
    };
    schema: Object;
    items: string[];
  }>();

  const emit = defineEmits<{
    (e: "submit", event: any): void;
    (e: "handleRefreshAvatars"): void;
  }>();
</script>

<style scoped></style>
