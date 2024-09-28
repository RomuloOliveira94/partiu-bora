<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import * as v from "valibot";

  const schema = v.object({
    evento: v.string("O nome do evento é obrigatório."),
    data: v.string("A data do evento é obrigatória."),
    quantidadeMaxima: v.optional(v.number()),
    registrante: v.string("O seu nome é obrigatório."),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    evento: undefined,
    data: undefined,
    quantidadeMaxima: undefined,
    registrante: undefined,
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify(event),
    });

    console.log(criar);
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <div>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
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
          type="number"
          size="sm"
          icon="i-heroicons-user-group-solid"
        />
      </UFormGroup>

      <UFormGroup label="Seu nome" name="registrante">
        <UInput
          v-model="state.registrante"
          type="text"
          size="sm"
          icon="i-heroicons-user-circle-16-solid"
        />
      </UFormGroup>

      <UButton type="submit"> Submit </UButton>
    </UForm>
  </div>
</template>
