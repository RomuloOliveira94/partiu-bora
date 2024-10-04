<script setup lang="ts">
  import useFetchPublicEvent from "~/composables/UseFetchPublicEvent";
  import { gerarAvataresAleatorios } from "~/helpers/static";
  import { formatDateTime } from "~/helpers";
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
  <div v-if="res?.status === 404 || res?.status === 500">
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
        <div
          class="md:flex md:justify-between md:flex-row md:items-center grid gap-2"
        >
          <div>
            <h2
              class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ evento?.evento?.nome }}
            </h2>
            <div class="flex items-center flex-wrap gap-2">
              <small
                >Criado por:
                <strong>{{ evento?.evento?.registranteNome }}</strong></small
              >
              <small class="flex items-center gap-1"
                ><UIcon name="i-logos:whatsapp-icon" class="w-4 h-4" />
                {{ evento?.evento?.registranteWhatsApp }}</small
              >
            </div>
            <p class="mt-1.5">
              Data:
              <strong>{{ formatDateTime(res?.evento?.data) }}</strong>
            </p>
          </div>
          <NuxtImg
            :src="evento?.evento?.imageUrl"
            :alt="'Imagem do evento: ' + evento?.evento?.nome"
            class="rounded-md w-full md:w-44"
          />
        </div>
      </template>
      <div class="grid">
        <div class="mb-4">
          <UAlert
            v-if="isPart && config.public.environment === 'production'"
            icon="i-heroicons-check-circle-20-solid"
            title="Presença confirmada!"
            color="primary"
            variant="solid"
            class="text-lg w-full mt-2 md:w-72 p-2"
            :ui="{ title: 'text-lg', icon: { base: 'h-8 w-8' } }"
          />

          <UButton
            v-else
            color="primary"
            icon="i-heroicons-check-circle-20-solid"
            size="lg"
            class="text-lg w-full mt-2 md:w-auto"
            @click="showConfirmModal = true"
          >
            Marcar Presença!
          </UButton>
        </div>
        <div>
          <h2 class="text-2xl">Convidados:</h2>
          <div
            v-if="
              evento?.evento?.convidados &&
              evento?.evento?.convidados.length > 0
            "
            class="grid lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4"
          >
            <div
              v-for="convidado in evento?.evento?.convidados"
              :key="convidado.id"
            >
              <UCard>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="w-full">
                      <span class="block"> Nome: </span>
                      <strong>{{ convidado.nome.slice(0, 18) }}</strong>
                    </p>
                    <p
                      class="mt-1.5 flex items-center gap-1 hover:cursor-pointer hover:text-blue-500 hover:underline"
                      @click="handleWhatsApp(convidado.telefone)"
                    >
                      <UIcon name="i-logos:whatsapp-icon" class="w-5 h-5" />
                      <strong>{{ convidado.telefone }}</strong>
                    </p>
                  </div>
                  <UAvatar
                    :src="
                      convidado.avatarUrl
                        ? convidado.avatarUrl
                        : `https://ui-avatars.com/api/?name=${convidado.nome}&background=random`
                    "
                    size="xl"
                  />
                </div>
              </UCard>
            </div>
          </div>
          <div
            v-if="
              evento?.evento?.convidados &&
              evento?.evento?.convidados.length <= 0
            "
          >
            <h2 class="text-lg font-bold mt-4">
              Nenhum convidado confirmado ainda, seja o primeiro a confirmar!
            </h2>
          </div>
        </div>
      </div>
      <template
        v-if="
          evento?.evento?.convidados && evento?.evento?.convidados.length > 5
        "
        #footer
      >
        <div>
          <UAlert
            v-if="isPart && config.public.environment === 'production'"
            icon="i-heroicons-check-circle-20-solid"
            title="Presença confirmada!"
            color="primary"
            variant="solid"
            class="text-lg w-full mt-2 md:w-auto p-2"
            :ui="{ title: 'text-lg', icon: { base: 'h-8 w-8' } }"
          />
          <UButton
            v-else
            color="primary"
            icon="i-heroicons-check-circle-20-solid"
            size="lg"
            class="text-lg w-full md:w-auto"
            @click="showConfirmModal = true"
          >
            Marcar Presença!
          </UButton>
        </div>
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
