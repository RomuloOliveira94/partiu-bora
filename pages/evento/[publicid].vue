<script setup lang="ts">
  interface Response {
    status: number;
    evento: {
      id: number;
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
  import { formatDateTime } from "~/helpers";
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
  const route = useRoute();
  const toast = useToast();

  const publicid = ref(route.params.publicid);
  const { data: res } = useFetch<Response>(`/api/eventos/${publicid.value}`);

  const showConfirmModal = ref(false);
  const open = ref(true);
  const evento = ref(res);
  const isPart = useCookie(`evento-${publicid.value}`);

  useSeoMeta({
    title: "Evento",
    description: `Página do evento ${
      res.value?.evento?.nome ? res.value?.evento?.nome : " não encontrada"
    }`,
  });

  const schema = v.object({
    nome: v.string("O seu nome é obrigatório."),
    telefone: v.string("O seu WhatsApp é obrigatório."),
    avatarUrl: v.optional(v.string()),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    nome: undefined,
    telefone: undefined,
    avatarUrl: "",
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { body, status } = await $fetch(
      `/api/eventos/${res.value?.evento.id}`,
      {
        method: "POST",
        body: JSON.stringify(event),
      }
    );

    if (status === 200) {
      showConfirmModal.value = false;
      evento.value?.evento?.convidados?.push({
        id: body.data.id,
        nome: body.data.nome,
        avatarUrl: body.data.avatarUrl,
        telefone: body.data.telefone,
      });
      //isPart.value = "true";
      toast.add({
        title: "Presença confirmada!",
        description: "Obrigado por confirmar sua presença!",
        icon: "i-heroicons-check-circle-20-solid",
        timeout: 5000,
      });
    }

    if (status === 404 || status === 500) {
      toast.add({
        title: "Erro",
        description:
          "Ocorreu um erro ao tentar confirmar sua presença, tente novamente.",
        icon: "i-noto:face-with-diagonal-mouth",
        timeout: 5000,
      });
    }
  }
  const items = ref([
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },

    {
      src: `https://api.dicebear.com/9.x/lorelei/svg?seed=Katherine`,
    },
    {
      src: `https://api.dicebear.com/9.x/lorelei/svg?seed=Avery`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
    {
      src: `https://ui-avatars.com/api/?name=SN&background=random`,
    },
  ]);
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
          class="md:flex md:justify-between md:flex-row md:items-center grid gap-2"
        >
          <div>
            <h2
              class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ evento?.evento?.nome }}
            </h2>
            <div class="flex items-center flex-wrap gap-2">
              <small
                >Criado por:
                <strong>{{ evento?.evento?.registranteNome }}</strong></small
              >
              <small class="flex items-center gap-1"
                ><UIcon name="i-logos:whatsapp-icon" class="w-4 h-4" />
                {{ evento?.evento?.registranteWhatsApp }}</small
              >
            </div>
          </div>
          <img
            :src="evento?.evento?.imageUrl"
            class="rounded-md w-full md:w-44"
          />
          <p class="mt-1.5">
            Data:
            <strong>{{ formatDateTime(res?.evento?.data) }}</strong>
          </p>
        </div>

        <UAlert
          v-if="isPart"
          icon="i-heroicons-check-circle-20-solid"
          title="Presença confirmada!"
          color="primary"
          variant="solid"
          class="text-lg w-full mt-2 md:w-auto p-2"
          :ui="{ title: 'text-lg', icon: { base: 'h-8 w-8' } }"
        />

        <UButton
          v-else
          color="primary"
          icon="i-heroicons-check-circle-20-solid"
          size="lg"
          class="text-lg w-full mt-2 md:w-auto"
          @click="showConfirmModal = true"
        >
          Marcar Presença!
        </UButton>
      </template>
      <div class="grid">
        <div>
          <h2 class="text-2xl">Convidados:</h2>
          <div
            v-if="
              evento?.evento?.convidados &&
              evento?.evento?.convidados.length > 0
            "
            class="grid lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4"
          >
            <div
              v-for="convidado in evento?.evento?.convidados"
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
          <div
            v-if="
              evento?.evento?.convidados &&
              evento?.evento?.convidados.length <= 0
            "
          >
            <h2 class="text-lg font-bold mt-4">
              Nenhum convidado confirmado ainda, seja o primeiro a confirmar!
            </h2>
          </div>
        </div>
      </div>
      <template #footer>
        <div>
          <UAlert
            v-if="isPart"
            icon="i-heroicons-check-circle-20-solid"
            title="Presença confirmada!"
            color="primary"
            variant="solid"
            class="text-lg w-full mt-2 md:w-auto p-2"
            :ui="{ title: 'text-lg', icon: { base: 'h-8 w-8' } }"
          />
          <UButton
            v-else
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
          <div class="flex items-center flex-col gap-4 w-full">
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
              class="self-start w-fit"
            >
              <UPopover :popper="{ arrow: true }" v-model:open="open">
                <UButton
                  color="white"
                  trailing-icon="i-heroicons-chevron-down-20-solid"
                >
                  <UAvatar
                    :src="
                      state.avatarUrl
                        ? state.avatarUrl
                        : state.nome
                        ? `https://ui-avatars.com/api/?name=${state.nome}&background=random`
                        : `https://ui-avatars.com/api/?name=SN&background=random`
                    "
                    size="md"
                  />
                </UButton>

                <template #panel>
                  <div class="flex gap-2 p-4 items-center flex-wrap">
                    <div v-for="(item, index) in items" :key="index">
                      <UAvatar
                        :src="item.src"
                        size="md"
                        @click="
                          state.avatarUrl = item.src;
                          open = false;
                        "
                      />
                    </div>
                  </div>
                </template>
              </UPopover>
            </UFormGroup>
          </div>
          <UButton type="submit">Confirmar Presença!</UButton>
        </UForm>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped></style>
