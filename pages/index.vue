<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { formatDateTime } from "~/helpers";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
  import type { Evento } from "~/server/db/schema";

  const items = [
    "https://picsum.photos/1920/1080?random=1",
    "https://picsum.photos/1920/1080?random=2",
    "https://picsum.photos/1920/1080?random=3",
    "https://picsum.photos/1920/1080?random=4",
    "https://picsum.photos/1920/1080?random=5",
    "https://picsum.photos/1920/1080?random=6",
    "https://picsum.photos/1920/1080?random=7",
    "https://picsum.photos/1920/1080?random=8",
    "https://picsum.photos/1920/1080?random=9",
    "https://picsum.photos/1920/1080?random=10",
    "https://picsum.photos/1920/1080?random=11",
    "https://picsum.photos/1920/1080?random=12",
  ];

  const eventCreated = ref(false);
  const eventCreatedData = reactive<Evento>({
    nome: "",
    data: "",
    registranteNome: "",
    registranteWhatsApp: "",
    quantidadeMaxima: 0,
    linkPublico: "",
    linkAdmin: "",
    imageUrl: "",
    dataDaCriacao: "",
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
    state.imageUrl = items[0];
    state.quantidadeMaxima = "112";
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <div>
    <UButton @click="devButton">Preencher formulário</UButton>
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
        <UCarousel v-slot="{ item }" :items="items" arrows>
          <img
            @click="handleSelect(item)"
            :src="item"
            :class="item === state.imageUrl ? 'border-2 border-green-500' : ''"
            class="cursor-pointer hover:border-green-500 hover:border-2 rounded-md mx-1 md:w-[450px] w-[250px] h-full"
            draggable="false"
          />
        </UCarousel>
      </UFormGroup>

      <UButton type="submit"> Criar Evento! </UButton>
    </UForm>

    <UModal v-model="eventCreated">
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
              @click="eventCreated = false"
            />
          </div>
        </template>
        <div>
          <div
            class="flex items-center flex-col md:flex-row gap-2 bg-gray-800 p-4 rounded-md mb-6"
          >
            <img
              :src="eventCreatedData.imageUrl"
              class="rounded-md w-full md:w-44"
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
                Registrante: <strong>{{ eventCreatedData.registranteNome }}</strong>
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
            <h2 class="font-bold text-xl mb-4">Links para compartilhamento:</h2>
            <div class="grid gap-2">
              <p>Código do evento para convidados: <strong>123456</strong></p>
              Link para o evento (copiar):
              <p class="truncate">
                <strong>https://partiubora.vercel.app/evento/123456</strong>
              </p>
              <p>Código do evento para Administrar: <strong>123456</strong></p>
              Link para o evento:
              <p class="truncate">
                <strong>https://partiubora.vercel.app/admin/123456</strong>
              </p>
              <!-- <UButton
              class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring"
            >
              WhatsApp
            </UButton>
            <UButton
              class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring"
            >
              Telegram
            </UButton>
            <UButton
              class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring"
            >
              Facebook
            </UButton>
            <UButton
              class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring"
            >
              Twitter
            </UButton> -->
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
