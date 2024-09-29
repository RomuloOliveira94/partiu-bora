<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";

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
    evento: undefined,
    data: undefined,
    quantidadeMaxima: undefined,
    registrante: undefined,
    registranteWhatsApp: undefined,
    imageUrl: "",
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify(event),
    });

    console.log(criar);
  }

  const selected = ref("sms");

  function handleSelect(item: string) {
    console.log(item);
    state.imageUrl = item;
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <div>
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
      <UFormGroup
        label="Imagem para o evento (opcional)"
        name="imageUrl"
      >
        <UCarousel v-slot="{ item }" :items="items" arrows>
          <img
            @click="handleSelect(item)"
            :src="item"
            class="cursor-pointer border-2 border-transparent hover:border-green-500 rounded-md mx-1 md:w-[500px] w-[250px] h-full"
            :class="{ 'border-green-500': item === state.imageUrl }"
            draggable="false"
          />
        </UCarousel>
      </UFormGroup>

      <UButton type="submit"> Criar Evento! </UButton>
    </UForm>
  </div>
</template>
