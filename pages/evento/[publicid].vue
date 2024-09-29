<script setup lang="ts">
  import { type Evento } from "~/server/db/schema";

  interface Response {
    status: number;
    evento: Evento;
  }

  const route = useRoute();
  const publicid = ref(route.params.publicid);

  const { data: res } = useFetch<Response>(`/api/eventos/${publicid.value}`);

  useSeoMeta({
    title: "Evento",
    description: `Página do evento ${
      res.value?.evento?.nome ? res.value?.evento?.nome : " não encontrada"
    }`,
  });
</script>

<template>
  <div v-if="res?.status === 404">
    <p class="text-xl">
      O evento não foi encontrado, por favor verifique o número do evento
      Corretamente.
    </p>
  </div>
  <div v-else>
    teste
    <p>publicid: {{ publicid }}</p>
    <h2>Nome do evento {{ res?.evento.data }}</h2>
  </div>
</template>
