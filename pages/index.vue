<script setup lang="ts">
  import type { Evento } from "~/server/db/schema";
  const config = useRuntimeConfig();
  const appUrl = config.public.url;
  const toast = useToast();

  const myEvents = useMyEvents();

  const eventCreated = ref(false);
  const eventCreatedData = reactive<Evento>({
    nome: "",
    data: 0,
    local: "",
    descricao: "",
    registranteNome: "",
    registranteWhatsApp: "",
    quantidadeMaxima: 0,
    linkPublico: "",
    linkAdmin: "",
    imageUrl: "",
    dataDaCriacao: 0,
    id: 0,
  });

  async function onCreateEvent(submitData: any) {
    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify(submitData),
    });

    if (criar.statusCode === 200) {
      eventCreatedData.nome = criar.body.data.nome;
      eventCreatedData.data = criar.body.data.data;
      eventCreatedData.local = criar.body.data.local;
      eventCreatedData.descricao = criar.body.data.descricao;
      eventCreatedData.registranteNome = criar.body.data.registranteNome;
      eventCreatedData.registranteWhatsApp = criar.body.data.registranteWhatsApp;
      eventCreatedData.quantidadeMaxima = criar.body.data.quantidadeMaxima;
      eventCreatedData.linkPublico = criar.body.data.linkPublico;
      eventCreatedData.linkAdmin = criar.body.data.linkAdmin;
      eventCreatedData.imageUrl = criar.body.data.imageUrl;
      eventCreatedData.dataDaCriacao = criar.body.data.dataDaCriacao;
      eventCreatedData.id = criar.body.data.id;
      myEvents.addEvent({
        adminId: criar.body.data.linkAdmin,
        publicId: criar.body.data.linkPublico,
        nome: criar.body.data.nome,
        data: criar.body.data.data,
      });
      eventCreated.value = true;
    }
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <UCard>
    <template #header>
      <h1 class="md:text-2xl text-xl font-semibold">
        Crie seu evento ou compromisso (Grátis)
      </h1>
    </template>

    <EventForm mode="create" @submit="onCreateEvent" />

    <EventCreatedModal
      v-if="eventCreated"
      @update:eventCreated="eventCreated = $event"
      :eventCreated="eventCreated"
      :eventCreatedData="eventCreatedData"
      :appUrl="appUrl"
    />
  </UCard>
</template>
