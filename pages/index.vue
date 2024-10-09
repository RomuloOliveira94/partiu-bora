<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
  import type { Evento } from "~/server/db/schema";
  import { images } from "~/helpers/static";

  const config = useRuntimeConfig();
  const appUrl = config.public.url;
  const showImgs = ref(false);

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
    if (state.imageUrl === item) {
      state.imageUrl = "";
      return;
    }

    state.imageUrl = item;
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
  <UCard>
    <template #header>
      <h1 class="md:text-2xl font-semibold">
        Crie seu evento ou compromisso (É gratis!
        <UIcon name="emojione-v1:winking-face" />):
      </h1>
    </template>

    <UButton
      v-if="config.public.environment === 'development'"
      @click="devButton"
      class="mb-6"
      icon="i-heroicons-code-bracket"
      trailing
      >Dev</UButton
    >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nome do evento" name="evento">
        <UInput
          v-model="state.evento"
          type="text"
          size="sm"
          icon="i-heroicons-newspaper"
        />
      </UFormGroup>
      <div
        class="flex items-center flex-col justify-center md:flex-row gap-4 w-full"
      >
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
        <template #label>
          <div
            class="flex items-start flex-col justify-center md:flex-row md:items-center gap-4 mb-2"
          >
            Imagem para o evento (opcional)
            <div>
              <UButton
                @click="
                  showImgs = !showImgs;
                  state.imageUrl = '';
                "
                :icon="
                  showImgs
                    ? 'i-heroicons-photo-16-solid'
                    : 'zondicons:close-outline'
                "
                trailing
                size="md"
                class="text-sm font-semibold"
                >{{
                  showImgs ? "Esconder imagens" : "Mostrar imagens"
                }}</UButton
              >
            </div>
          </div>
        </template>
        <UCarousel v-if="showImgs" v-slot="{ item }" :items="images" arrows>
          <img
            @click="handleSelect(item)"
            :src="item"
            :class="item === state.imageUrl ? 'border-2 border-green-500' : ''"
            class="cursor-pointer hover:border-green-500 hover:border-2 rounded-md mx-1 md:w-[250px] w-[250px] h-full object-cover"
            draggable="false"
          />
        </UCarousel>
      </UFormGroup>
      <div class="flex justify-center md:justify-start">
        <UButton
          type="submit"
          icon="i-heroicons-check-circle"
          size="xl"
          class="text-xl font-semibold mt-8"
          trailing
        >
          Criar Evento!
        </UButton>
      </div>
    </UForm>

    <EventCreatedModal
      v-if="eventCreated"
      @update:eventCreated="eventCreated = $event"
      :eventCreated="eventCreated"
      :eventCreatedData="eventCreatedData"
      :appUrl="appUrl"
    />
  </UCard>
</template>
