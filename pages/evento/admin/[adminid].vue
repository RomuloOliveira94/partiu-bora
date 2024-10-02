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
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-center">Administração do evento</h1>
      <small class="text-center block my-0 py-0"
        >Clique para desconvidar o usuário.</small
      >
    </div>

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
            <p class="mt-1.5">
              Data:
              <strong>{{ formatDateTime(evento?.evento?.data) }}</strong>
            </p>
          </div>
          <img
            :src="evento?.evento?.imageUrl"
            class="rounded-md w-full md:w-44"
          />
        </div>
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
              class="relative"
            >
              <UCard>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="w-full" @click="desconvidar(convidado.id)">
                      <span class="block"> Nome: </span>
                      <strong>{{ convidado.nome.slice(0, 18) }}</strong>
                    </p>
                    <p
                      class="mt-1.5 flex items-center gap-1 hover:cursor-pointer hover:text-blue-500 hover:underline"
                      @click="handleWhatsApp(convidado.telefone)"
                    >
                      <UIcon name="i-logos:whatsapp-icon" class="w-5 h-5" />
                      <strong>{{ convidado.telefone }}</strong>
                    </p>
                  </div>
                  <div class="grid gap-2">
                    <UTooltip
                      text="Desconvidar Usuário"
                      class="absolute -top-2 -right-3 rounded-full z-30"
                    >
                      <UButton
                        color="red"
                        icon="i-heroicons-x-circle-20-solid"
                        size="xs"
                        class="text-sm rounded-full"
                        @click="desconvidar(convidado.id)"
                      />
                    </UTooltip>
                    <UAvatar
                      @click="desconvidar(convidado.id)"
                      :src="
                        convidado.avatarUrl
                          ? convidado.avatarUrl
                          : `https://ui-avatars.com/api/?name=${convidado.nome}&background=random`
                      "
                      size="xl"
                    />
                  </div>
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
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import useFetchAdminEvent from "~/composables/UseFetchAdminEvent";
  import { formatDateTime } from "~/helpers";

  const route = useRoute();
  const toast = useToast();

  const adminid = ref(route.params.adminid);
  const { res } = useFetchAdminEvent(adminid);

  const evento = ref(res);

  const desconvidar = async (id: number) => {
    console.log(id);
    if (!evento?.value?.evento) return;

    const confirm = window.confirm(
      "Tem certeza que deseja desconvidar este convidado?"
    );

    if (confirm) {
      const { status }: { status: number } = await $fetch(`/api/admin/${id}`, {
        method: "DELETE",
      });

      if (status === 200) {
        evento.value.evento.convidados = evento.value.evento.convidados.filter(
          (convidado) => convidado.id !== id
        );

        toast.add({
          title: "Sucesso",
          description: "Desconvidado com sucesso!",
          icon: "i-material:check",
          timeout: 2000,
        });
      }

      if (status === 404) {
        toast.add({
          title: "Erro",
          description: "Erro ao desconvidar convidado.",
          icon: "i-noto:face-with-diagonal-mouth",
          timeout: 2000,
        });
      }
    }
  };

  const handleWhatsApp = (telefone: string) => {
    let clearedNumber = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/+55${clearedNumber}`);
  };
</script>
