<script setup lang="ts">
  import useFetchPublicEvent from "~/composables/UseFetchPublicEvent";
  import { gerarAvataresAleatorios } from "~/helpers/static";
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import useSubmitParticipate from "~/composables/useSubmitParticipate";

  const config = useRuntimeConfig();
  const route = useRoute();
  const publicid = ref(route.params.publicid);
  const { res } = useFetchPublicEvent(publicid);

  const evento = ref(res);
  const showConfirmModal = ref(false);
  const open = ref(true);
  const isPart = useCookie(`evento-${publicid.value}`);
  const { state, schema, onSubmit } = useSubmitParticipate(
    showConfirmModal,
    evento,
    isPart
  );

  useSeoMeta({
    title: "Evento",
    description: `Página do evento ${
      res.value?.evento?.nome ? res.value?.evento?.nome : " não encontrada"
    }`,
  });

  const items = ref(gerarAvataresAleatorios(24));

  const handleRefreshAvatars = () => {
    items.value = gerarAvataresAleatorios(24);
  };

  const handleWhatsApp = (telefone: string) => {
    let clearedNumber = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/+55${clearedNumber}`);
  };
</script>

<template>
  <div v-if="res?.status === 404 || res?.status === 500 || !evento?.evento">
    <UAlert
      icon="i-noto:face-with-diagonal-mouth"
      title="Evento não encontrado"
      description="Por favor verifique se o número está correto, ou crie outro no
    link acima."
      color="primary"
      variant="solid"
      :ui="{ title: 'text-xl', icon: { base: 'h-8 w-8' } }"
    />
  </div>
  <div v-else>
    <UCard>
      <template #header>
        <EventHeader :evento="evento?.evento" />
      </template>
      <div class="grid">
        <EventGuestConfirmButton
          :isPart="isPart"
          :config="config"
          @confirmPresence="showConfirmModal = true"
        />
        <EventGuestsComponent :convidados="evento?.evento?.convidados" />
      </div>
      <template
        v-if="
          evento?.evento?.convidados && evento?.evento?.convidados.length > 5
        "
        #footer
      >
        <EventGuestConfirmButton
          :isPart="isPart"
          :config="config"
          class="md:hidden"
          @confirmPresence="showConfirmModal = true"
        />
      </template>
    </UCard>
    <UModal v-model="showConfirmModal">
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
          @submit="onSubmit"
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
                      @click="handleRefreshAvatars()"
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
    </UModal>
  </div>
</template>

<style scoped></style>
