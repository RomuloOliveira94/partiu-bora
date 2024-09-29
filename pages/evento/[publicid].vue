<script setup lang="ts">
  import { formatDateTime } from "~/helpers";
  interface Response {
    status: number;
    evento: {
      nome: string;
      data: number;
      descricao: string;
      local: string;
      endereco: string;
      cidade: string;
      estado: string;
      pais: string;
      imageUrl: string;
      registranteNome: string;
      registranteWhatsApp: string;
      convidados: {
        id: number;
        nome: string;
        telefone: string;
      }[];
    };
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
  <div v-if="res?.status === 404 || res?.status === 500">
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
        <h2
          class="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
        >
          {{ res?.evento?.nome }}
        </h2>
        <div class="flex gap-1">
          <small>Criado por: {{ res?.evento?.registranteNome }}</small>
          -
          <small>{{ res?.evento?.registranteWhatsApp }}</small>
        </div>
      </template>
      <div class="grid gap-4">
        <div>
          <img :src="res?.evento?.imageUrl" class="rounded-md w-full md:w-44" />
          <div>
            <p class="mt-1.5">
              Data:
              <strong>{{ formatDateTime(res?.evento?.data) }}</strong>
            </p>
            <!--  <p class="mt-1.5">
              Descrição:
              <strong>{{ res?.evento?.descricao }}</strong>
            </p>
            <p class="mt-1.5">
              Local:
              <strong>{{ res?.evento?.local }}</strong>
            </p>
            <p class="mt-1.5">
              Endereço:
              <strong>{{ res?.evento?.endereco }}</strong>
            </p>
            <p class="mt-1.5">
              Cidade:
              <strong>{{ res?.evento?.cidade }}</strong>
            </p>
            <p class="mt-1.5">
              Estado:
              <strong>{{ res?.evento?.estado }}</strong>
            </p>
            <p class="mt-1.5">
              País:
              <strong>{{ res?.evento?.pais }}</strong>
            </p> -->
          </div>
        </div>
        <div>
          <h2 class="text-2xl">Convidados</h2>
          <div class="grid lg:grid-cols-3 xl:grid-cols-4 gap-2 h-full mt-4">
            <div
              v-for="convidado in res?.evento?.convidados"
              :key="convidado.id"
            >
              <UCard>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="mt-1.5">
                      Nome:
                      <strong>{{ convidado.nome }}</strong>
                    </p>
                    <p class="mt-1.5">
                      WhatsApp:
                      <strong>{{ convidado.telefone }}</strong>
                    </p>
                  </div>
                  <UAvatar
                    :src="`https://ui-avatars.com/api/?name=${convidado.nome}&background=random`"
                    class="ml-4"
                  />
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </UCard>
  </div>
</template>
