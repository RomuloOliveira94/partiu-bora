<script setup lang="ts">
  import useFetchPublicEvent from "~/composables/UseFetchPublicEvent";
  import { gerarAvataresAleatorios } from "~/helpers/static";
  import { handleWhatsApp } from "~/helpers";
  import type { FormSubmitEvent } from "#ui/types";
  import useSubmitParticipate from "~/composables/useSubmitParticipate";

  const config = useRuntimeConfig();
  const route = useRoute();
  const publicid = ref(route.params.publicid);
  const { res } = await useFetchPublicEvent(publicid);

  const evento = ref(res);
  useMetaTags(evento.value?.evento);

  const showConfirmModal = ref(false);
  const isPart = useCookie(`evento-${publicid.value}`);
  const { state, schema, onSubmit } = useSubmitParticipate(
    showConfirmModal,
    evento,
    isPart
  );

  const items = ref(gerarAvataresAleatorios(24));

  const handleRefreshAvatars = () => {
    items.value = gerarAvataresAleatorios(24);
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
  <div v-else class="pb-20 md:pb-0">
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
        <EventGuestsComponent
          :convidados="evento?.evento?.convidados"
          @handleWhatsApp="handleWhatsApp"
        />
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
    <!-- Fixed bottom bar for mobile -->
    <div
      class="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden"
    >
      <EventGuestConfirmButton
        :isPart="isPart"
        :config="config"
        @confirmPresence="showConfirmModal = true"
      />
    </div>
    <UModal
      v-model="showConfirmModal"
      :ui="{
        overlay: { base: 'bg-gray-950/30 dark:bg-gray-950/70' },
        ring: '',
        shadow: ''
      }"
    >
      <EventGuestConfirmationForm
        :event="evento?.evento"
        :appUrl="config.public.url"
        :state="state"
        :schema="schema"
        :items="items"
        @handleRefreshAvatars="handleRefreshAvatars"
        @submit="onSubmit"
        @close="showConfirmModal = false"
      />
    </UModal>
  </div>
</template>

<style scoped></style>
