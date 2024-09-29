<script setup lang="ts">
  import { formatDateTime } from "~/helpers";
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
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
        avatarUrl: string;
        telefone: string;
      }[];
    };
  }

  const route = useRoute();
  const publicid = ref(route.params.publicid);
  const showConfirmModal = ref(false);
  const open = ref(true);

  const { data: res } = useFetch<Response>(`/api/eventos/${publicid.value}`);

  useSeoMeta({
    title: "Evento",
    description: `Página do evento ${
      res.value?.evento?.nome ? res.value?.evento?.nome : " não encontrada"
    }`,
  });

  const schema = v.object({
    nome: v.string("O nome é obrigatório."),
    telefone: v.string("O telefone é obrigatório."),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    nome: "",
    telefone: "",
    avatarUrl: "",
  });

  const items = ref([
    [
      {
        slot: "avatar",
        label: "Avatar 1",
        src: `https://ui-avatars.com/api/?name=SN&background=random`,
        click: () => {
          state.avatarUrl = `https://ui-avatars.com/api/?name=SN&background=random`;
        },
      },
    ],
    [
      {
        slot: "avatar",
        label: "Avatar 1",
        src: `https://api.dicebear.com/9.x/lorelei/svg?seed=Katherine`,
        click: () => {
          state.avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=Katherine`;
        },
      },
    ],
    [
      {
        slot: "avatar",
        label: "Avatar 1",
        src: `https://api.dicebear.com/9.x/lorelei/svg?seed=Avery`,
        click: () => {
          state.avatarUrl = `https://api.dicebear.com/9.x/lorelei/svg?seed=Avery`;
        },
      },
    ],
    [
      {
        slot: "avatar",
        label: "Avatar 1",
        src: `https://ui-avatars.com/api/?name=SN&background=random`,
      },
    ],
  ]);

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    /* const confirmar = await $fetch(`/api/eventos/${publicid.value}/confirmar`, {
      method: "POST",
      body: JSON.stringify(event),
    });

    if (confirmar.statusCode === 200) {
      console.log("Presença confirmada com sucesso!");
      console.log(confirmar);
      showConfirmModal.value = false;
    } */
    console.log(event);
  }
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
        <div
          class="flex justify-between md:flex-row md:items-center flex-col gap-2"
        >
          <div>
            <h2
              class="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ res?.evento?.nome }}
            </h2>
            <div class="flex items-center flex-wrap gap-2">
              <small
                >Criado por:
                <strong>{{ res?.evento?.registranteNome }}</strong></small
              >
              <small class="flex items-center gap-1"
                ><UIcon name="i-logos:whatsapp-icon" class="w-4 h-4" />
                {{ res?.evento?.registranteWhatsApp }}</small
              >
            </div>
          </div>
          <img :src="res?.evento?.imageUrl" class="rounded-md w-full md:w-44" />
        </div>
        <UButton
          color="primary"
          icon="i-heroicons-check-circle-20-solid"
          size="lg"
          class="text-lg w-full mt-2 md:w-auto"
          @click="showConfirmModal = true"
        >
          Marcar Presença!
        </UButton>
      </template>
      <div class="grid gap-4">
        <div>
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
          <h2 class="text-2xl">Convidados:</h2>
          <div class="grid lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
            <div
              v-for="convidado in res?.evento?.convidados"
              :key="convidado.id"
            >
              <UCard>
                <div class="flex items-center justify-between">
                  <div>
                    <p>
                      Nome:
                      <strong>{{ convidado.nome }}</strong>
                    </p>
                    <p class="mt-1.5 flex items-center gap-1">
                      <UIcon name="i-logos:whatsapp-icon" class="w-4 h-4" />
                      <strong>{{ convidado.telefone }}</strong>
                    </p>
                  </div>
                  <UAvatar
                    :src="
                      convidado.avatarUrl
                        ? convidado.avatarUrl
                        : `https://ui-avatars.com/api/?name=${convidado.nome}&background=random`
                    "
                    size="lg"
                  />
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <UButton
            color="primary"
            icon="i-heroicons-check-circle-20-solid"
            size="lg"
            class="text-lg w-full md:w-auto"
            @click="showConfirmModal = true"
          >
            Marcar Presença!
          </UButton>
        </div>
      </template>
    </UCard>
    <UModal v-model="showConfirmModal">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <h1>Confirmação:</h1>
        </template>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="flex items-center flex-col md:flex-row gap-4 w-full">
            <UFormGroup label="Seu nome" name="registrante" class="w-full">
              <UInput
                v-model="state.nome"
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
                v-model="state.telefone"
                type="tel"
                size="sm"
                icon="i-heroicons-phone"
                v-maska="'(##) #####-####'"
                placeholder="(99) 99999-9999"
              />
            </UFormGroup>
            <UFormGroup
              label="Avatar (opcional)"
              name="avatarUrl"
              class="w-full"
            >
              <UDropdown :items="items" :popper="{ placement: 'right-start' }">
                <UAvatar
                  :src="
                    state.avatarUrl
                      ? state.avatarUrl
                      : state.nome
                      ? `https://ui-avatars.com/api/?name=${state.nome}&background=random`
                      : `https://ui-avatars.com/api/?name=SN&background=random`
                  "
                  size="lg"
                />
                <template #avatar="{ item }">
                  <div class="flex items-center gap-2">
                    <UAvatar :src="item.src" size="lg" />
                  </div>
                </template>
              </UDropdown>
            </UFormGroup>
          </div>
          <UButton type="submit">Confirmar Presença!</UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
  .modal-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
