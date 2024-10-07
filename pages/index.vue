<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
  import type { Evento } from "~/server/db/schema";
  import { images } from "~/helpers/static";

  const config = useRuntimeConfig();
  const appUrl = config.public.url;

  const eventCreated = ref(false);
  const eventCreatedData = reactive<Evento>({
    nome: "",
    data: 0,
    registranteNome: "",
    registranteWhatsApp: "",
    quantidadeMaxima: 0,
    linkPublico: "",
    linkAdmin: "",
    imageUrl: "",
    dataDaCriacao: 0,
    id: 0,
  });

  const schema = v.object({
    evento: v.string("O nome do evento é obrigatório."),
    data: v.string("A data do evento é obrigatória."),
    quantidadeMaxima: v.optional(v.string()),
    registrante: v.string("O seu nome é obrigatório."),
    registranteWhatsApp: v.string("O seu WhatsApp é obrigatório."),
    imageUrl: v.optional(v.string()),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    evento: "",
    data: "",
    quantidadeMaxima: "",
    registrante: "",
    registranteWhatsApp: "",
    imageUrl: "",
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify(event),
    });

    if (criar.statusCode === 200) {
      console.log("Evento criado com sucesso!");
      console.log(criar);
      eventCreatedData.nome = criar.body.data.nome;
      eventCreatedData.data = criar.body.data.data;
      eventCreatedData.registranteNome = criar.body.data.registranteNome;
      eventCreatedData.registranteWhatsApp =
        criar.body.data.registranteWhatsApp;
      eventCreatedData.quantidadeMaxima = criar.body.data.quantidadeMaxima;
      eventCreatedData.linkPublico = criar.body.data.linkPublico;
      eventCreatedData.linkAdmin = criar.body.data.linkAdmin;
      eventCreatedData.imageUrl = criar.body.data.imageUrl;
      eventCreatedData.dataDaCriacao = criar.body.data.dataDaCriacao;
      eventCreatedData.id = criar.body.data.id;
      eventCreated.value = true;
      console.log(eventCreated.value);
    }
  }

  function handleSelect(item: string) {
    state.imageUrl = item;
    console.log(item);
  }

  function devButton() {
    state.evento = "Evento teste";
    state.data = "2022-12-31T23:59";
    state.registrante = "Fulano";
    state.registranteWhatsApp = "(99) 99999-9999";
    state.imageUrl = images[0];
    state.quantidadeMaxima = "112";
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <div>
    <UButton
      v-if="config.public.environment === 'development'"
      @click="devButton"
      >Preencher formulário</UButton
    >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="flex items-center flex-col md:flex-row gap-4 w-full">
        <UFormGroup label="Seu nome" name="registrante" class="w-full">
          <UInput
            v-model="state.registrante"
            type="text"
            size="sm"
            icon="i-heroicons-user-circle-16-solid"
          />
        </UFormGroup>
        <UFormGroup
          label="Seu WhatsApp"
          name="registranteWhatsApp"
          class="w-full"
        >
          <UInput
            v-model="state.registranteWhatsApp"
            type="tel"
            size="sm"
            icon="i-heroicons-phone"
            v-maska="'(##) #####-####'"
            placeholder="(99) 99999-9999"
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Nome do evento" name="evento">
        <UInput
          v-model="state.evento"
          type="text"
          size="sm"
          icon="i-heroicons-newspaper"
        />
      </UFormGroup>

      <UFormGroup label="Data e Hora" name="data">
        <UInput
          v-model="state.data"
          type="datetime-local"
          size="sm"
          icon="i-heroicons-calendar-days"
        />
      </UFormGroup>

      <UFormGroup
        label="Quantidade de Convidados (opcional)"
        name="quantidadeMaxima"
      >
        <UInput
          v-model="state.quantidadeMaxima"
          type="text"
          size="sm"
          icon="i-heroicons-user-group-solid"
          v-maska="'######'"
        />
      </UFormGroup>
      <UFormGroup label="Imagem para o evento (opcional)" name="imageUrl">
        <UCarousel v-slot="{ item }" :items="images" arrows>
          <img
            @click="handleSelect(item)"
            :src="item"
            :class="item === state.imageUrl ? 'border-2 border-green-500' : ''"
            class="cursor-pointer hover:border-green-500 hover:border-2 rounded-md mx-1 md:w-[250px] w-[250px] h-full object-cover"
            draggable="false"
          />
        </UCarousel>
      </UFormGroup>

      <UButton type="submit"> Criar Evento! </UButton>
    </UForm>

    <EventCreatedModal
      @update:eventCreated="eventCreated = $event"
      :eventCreated="eventCreated"
      :eventCreatedData="eventCreatedData"
      :appUrl="appUrl"
    />
  </div>
</template>
