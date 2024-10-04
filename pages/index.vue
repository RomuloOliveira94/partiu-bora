<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import { adminEventLink, eventLink, formatDateTime } from "~/helpers";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
  import type { Evento } from "~/server/db/schema";
  import { images } from "~/helpers/static";
  import { eventInviteText } from "~/helpers/static";

  const config = useRuntimeConfig();
  const appUrl = config.public.url;

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
    state.imageUrl = item;
    console.log(item);
  }

  function devButton() {
    state.evento = "Evento teste";
    state.data = "2022-12-31T23:59";
    state.registrante = "Fulano";
    state.registranteWhatsApp = "(99) 99999-9999";
    state.imageUrl = images[0];
    state.quantidadeMaxima = "112";
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copiado para a área de transferência!");
  }

  function handleGoTo(url: string) {
    window.open(url, "_blank")?.focus();
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <div>
    <UButton
      v-if="config.public.environment === 'development'"
      @click="devButton"
      >Preencher formulário</UButton
    >
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
        <UCarousel v-slot="{ item }" :items="images" arrows>
          <img
            @click="handleSelect(item)"
            :src="item"
            :class="item === state.imageUrl ? 'border-2 border-green-500' : ''"
            class="cursor-pointer hover:border-green-500 hover:border-2 rounded-md mx-1 md:w-[250px] w-[250px] h-full object-cover"
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
            class="grid gap-4 p-4 rounded-md mb-6"
          >
            <NuxtImg
              :src="eventCreatedData.imageUrl || images[0]"
              :alt="eventCreatedData.nome"
              class="rounded-md w-full object-cover h-64"
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
                Registrante:
                <strong>{{ eventCreatedData.registranteNome }}</strong>
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
            <h2 class="font-bold text-xl mb-2">Links para compartilhamento:</h2>
            <div class="grid gap-4">
              <UCard>
                <h3>Código do evento para convidados:</h3>
                <UButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  class="my-2 flex items-center justify-between"
                  @click="handleCopy(eventCreatedData.linkPublico)"
                >
                  <strong>{{ eventCreatedData.linkPublico }}</strong>
                  <UIcon
                    name="i-heroicons-clipboard-20-solid"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
                <h3>Link para o evento (copiar):</h3>
                <UButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  class="w-64 min-[475px]:w-full mt-2 flex items-center justify-between"
                  @click="
                    handleCopy(eventLink(appUrl, eventCreatedData.linkPublico))
                  "
                >
                  <p class="truncate">
                    <strong>
                      {{ eventLink(appUrl, eventCreatedData.linkPublico) }}
                    </strong>
                  </p>
                  <UIcon
                    name="i-heroicons-clipboard-20-solid"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
              </UCard>
              <UCard>
                <h3>Código do evento para Administrar:</h3>
                <UButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  class="my-2 flex items-center justify-between"
                  @click="handleCopy(eventCreatedData.linkPublico)"
                >
                  <strong>{{ eventCreatedData.linkPublico }}</strong>
                  <UIcon
                    name="i-heroicons-clipboard-20-solid"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
                <h2>Link para o evento (copiar):</h2>
                <UButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  class="w-64 min-[475px]:w-full mt-2 flex items-center justify-between"
                  @click="
                    handleCopy(
                      adminEventLink(appUrl, eventCreatedData.linkAdmin)
                    )
                  "
                >
                  <p class="truncate">
                    <strong>
                      {{ adminEventLink(appUrl, eventCreatedData.linkAdmin) }}
                    </strong>
                  </p>
                  <UIcon
                    name="i-heroicons-clipboard-20-solid"
                    class="w-4 h-4 ml-1"
                  />
                </UButton>
              </UCard>
              <UCard>
                <template #header>
                  <h3 class="text-xl font-semibold">
                    Compartilhar nas redes sociais:
                  </h3>
                </template>
                <div class="flex items-center flex-wrap gap-4">
                  <UButton
                    variant="outline"
                    color="primary"
                    icon="logos:whatsapp-icon"
                    @click="
                      handleGoTo(
                        'https://api.whatsapp.com/send?text=' +
                          eventInviteText(
                            eventCreatedData.nome,
                            eventCreatedData.data,
                            eventLink(appUrl, eventCreatedData.linkPublico)
                          )
                      )
                    "
                  >
                    WhatsApp
                  </UButton>
                  <UButton
                    variant="outline"
                    color="primary"
                    icon="logos:telegram"
                    @click="
                      handleGoTo(
                        'https://t.me/share/url?url=' +
                          eventInviteText(
                            eventCreatedData.nome,
                            eventCreatedData.data,
                            eventLink(appUrl, eventCreatedData.linkPublico)
                          )
                      )
                    "
                  >
                    Telegram
                  </UButton>
                  <UButton
                    variant="outline"
                    color="primary"
                    icon="logos:facebook"
                    @click="
                      handleGoTo(
                        'https://www.facebook.com/sharer/sharer.php?u=' +
                          eventInviteText(
                            eventCreatedData.nome,
                            eventCreatedData.data,
                            eventLink(appUrl, eventCreatedData.linkPublico)
                          )
                      )
                    "
                  >
                    Facebook
                  </UButton>
                  <UButton
                    variant="outline"
                    color="primary"
                    icon="logos:bluesky"
                    @click="
                      handleGoTo(
                        'https://bsky.app/intent/compose?text=' +
                          eventInviteText(
                            eventCreatedData.nome,
                            eventCreatedData.data,
                            eventLink(appUrl, eventCreatedData.linkPublico)
                          )
                      )
                    "
                  >
                    Bluesky
                  </UButton>              
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
