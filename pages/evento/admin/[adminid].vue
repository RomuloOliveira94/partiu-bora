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
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-center">Administração do evento</h1>
      <small class="text-center block my-0 py-0"
        >Clique para desconvidar o usuário.</small
      >
    </div>

    <UCard>
      <template #header>
        <EventHeader :evento="evento?.evento" />
      </template>
      <EventGuestsComponent
        :convidados="evento?.evento?.convidados"
        :isAdmin="true"
        @desconvidar="desconvidar"
        @handleWhatsApp="handleWhatsApp"
      />
      <template #footer>
        <EventShareLinks :evento="evento.evento" :appUrl="appUrl" />
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import useFetchAdminEvent from "~/composables/UseFetchAdminEvent";
  import { handleWhatsApp } from "~/helpers";

  const route = useRoute();
  const toast = useToast();
  const config = useRuntimeConfig();
  const appUrl = config.public.url;

  const adminid = ref(route.params.adminid);
  const { res } = await useFetchAdminEvent(adminid);
  const evento = ref(res);
  useMetaTags(evento.value?.evento);

  const desconvidar = async (id: number) => {
    if (!evento?.value?.evento) return;

    const confirm = window.confirm(
      "Tem certeza que deseja desconvidar este convidado?"
    );

    if (confirm) {
      const response = await $fetch<{ status: number }>(`/api/admin/${id}`, {
        method: "DELETE",
      });
      const { status } = response;

      if (status === 200) {
        evento.value.evento.convidados = evento.value.evento.convidados.filter(
          (convidado) => convidado.id !== id
        );

        toast.add({
          title: "Sucesso",
          description: "Desconvidado com sucesso!",
          icon: "i-material:check",
          timeout: 2000,
        });
      }

      if (status === 404) {
        toast.add({
          title: "Erro",
          description: "Erro ao desconvidar convidado.",
          icon: "i-noto:face-with-diagonal-mouth",
          timeout: 2000,
        });
      }
    }
  };
</script>
