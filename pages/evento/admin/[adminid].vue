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
          <div class="grid gap-2">
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
            <p>
              Data:
              <strong>{{ formatDateTime(evento?.evento?.data) }}</strong>
            </p>
          </div>
          <NuxtImg
            :src="evento?.evento?.imageUrl"
            :alt="'Imagem do evento: ' + evento?.evento?.nome"
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
              Nenhum convidado confirmado ainda, convide alguém!
            </h2>
          </div>
        </div>
      </div>
      <template #footer>
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
          v-if="
            evento?.evento?.convidados && evento?.evento?.convidados.length <= 0
          "
        >
          <div>
            <div class="grid gap-2">
              <h2 class="font-bold text-xl mb-2">
                Links para compartilhamento:
              </h2>
              <div class="grid gap-4">
                <UCard>
                  <h3>Código do evento para convidados:</h3>
                  <UButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    class="my-2 flex items-center justify-between"
                    @click="handleCopy(evento?.evento?.linkPublico)"
                  >
                    <strong>{{ evento?.evento?.linkPublico }}</strong>
                    <UIcon
                      name="i-heroicons-clipboard-20-solid"
                      class="w-4 h-4 ml-1"
                    />
                  </UButton>
                  <h3>Link para o evento (copiar):</h3>
                  <div class="flex items-center gap-2">
                    <UButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      class="w-52 min-[475px]:w-fit flex items-center justify-between"
                      @click="
                        handleCopy(
                          eventLink(appUrl, evento?.evento?.linkPublico)
                        )
                      "
                    >
                      <p class="truncate">
                        <strong>
                          {{ eventLink(appUrl, evento?.evento?.linkPublico) }}
                        </strong>
                      </p>
                      <UIcon
                        name="i-heroicons-clipboard-20-solid"
                        class="w-4 h-4 ml-1"
                      />
                    </UButton>
                    <LinkButton
                      :link="eventLink(appUrl, evento?.evento?.linkPublico)"
                    />
                  </div>
                </UCard>
                <UCard>
                  <h3>Código do evento para Administrar:</h3>
                  <UButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    class="my-2 flex items-center justify-between"
                    @click="handleCopy(evento?.evento?.linkPublico)"
                  >
                    <strong>{{ evento?.evento?.linkPublico }}</strong>
                    <UIcon
                      name="i-heroicons-clipboard-20-solid"
                      class="w-4 h-4 ml-1"
                    />
                  </UButton>
                  <h2>Link para o evento (copiar):</h2>
                  <div class="flex items-center gap-2">
                    <UButton
                      size="sm"
                      color="primary"
                      variant="outline"
                      class="w-52 min-[475px]:w-fit flex items-center justify-between"
                      @click="
                        handleCopy(
                          adminEventLink(appUrl, evento?.evento?.linkAdmin)
                        )
                      "
                    >
                      <p class="truncate">
                        <strong>
                          {{
                            adminEventLink(appUrl, evento?.evento?.linkAdmin)
                          }}
                        </strong>
                      </p>
                      <UIcon
                        name="i-heroicons-clipboard-20-solid"
                        class="w-4 h-4 ml-1"
                      />
                    </UButton>
                    <LinkButton
                      :link="adminEventLink(appUrl, evento?.evento?.linkAdmin)"
                    />
                  </div>
                </UCard>
                <SocialEventShareCard :evento="evento" :appUrl="appUrl" />
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import useFetchAdminEvent from "~/composables/UseFetchAdminEvent";
  import { adminEventLink, eventLink, formatDateTime } from "~/helpers";

  const route = useRoute();
  const toast = useToast();
  const config = useRuntimeConfig();
  const appUrl = config.public.url;

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
      const response = await $fetch<{ status: number }>(`/api/admin/${id}`);
      const { status } = response;

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

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copiado para a área de transferência!");
  }
</script>
