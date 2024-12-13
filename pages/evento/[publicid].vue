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
    <UModal v-model="showConfirmModal">
      <EventGuestConfirmationForm
        :event="evento?.evento"
        :appUrl="config.public.url"
        :state="state"
        :schema="schema"
        :items="items"
        @handleRefreshAvatars="handleRefreshAvatars"
        @submit="onSubmit"
      />
    </UModal>
  </div>
</template>

<style scoped></style>
