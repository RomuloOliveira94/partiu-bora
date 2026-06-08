<script setup lang="ts">
  import { onUnmounted } from "vue";
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";
  import type { Evento } from "~/server/db/schema";
  const config = useRuntimeConfig();
  const appUrl = config.public.url;
  const toast = useToast();

  const myEvents = useMyEvents();

  const eventCreated = ref(false);
  const eventCreatedData = reactive<Evento>({
    nome: "",
    data: 0,
    local: "",
    descricao: "",
    registranteNome: "",
    registranteWhatsApp: "",
    quantidadeMaxima: 0,
    linkPublico: "",
    linkAdmin: "",
    imageUrl: "",
    dataDaCriacao: 0,
    id: 0,
  });

  // File upload state
  const selectedFile = ref<File | null>(null);
  const filePreview = ref<string | null>(null);
  const isUploading = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  const schema = v.object({
    evento: v.string("O nome do evento é obrigatório."),
    data: v.string("A data do evento é obrigatória."),
    local: v.optional(v.string()),
    descricao: v.optional(v.pipe(v.string(), v.maxLength(1000, "Descrição deve ter no máximo 1000 caracteres"))),
    quantidadeMaxima: v.optional(v.string()),
    registrante: v.string("O seu nome é obrigatório."),
    registranteWhatsApp: v.string("O seu WhatsApp é obrigatório."),
    imageUrl: v.optional(v.string()),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    evento: undefined as string | undefined,
    local: undefined as string | undefined,
    data: undefined as string | undefined,
    descricao: undefined as string | undefined,
    quantidadeMaxima: undefined as string | undefined,
    registrante: undefined as string | undefined,
    registranteWhatsApp: undefined as string | undefined,
    imageUrl: undefined as string | undefined,
  });

  function triggerFileInput() {
    fileInputRef.value?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // Validate file type
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.add({
        title: "Tipo de arquivo não suportado",
        description: "Use JPEG, PNG, WebP ou GIF",
        color: "error",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.add({
        title: "Imagem muito grande",
        description: "O tamanho máximo é 3MB",
        color: "error",
      });
      return;
    }

    selectedFile.value = file;
    // Create preview URL
    filePreview.value = URL.createObjectURL(file);
    state.imageUrl = undefined; // Clear static image if any
  }

  function clearFile() {
    selectedFile.value = null;
    if (filePreview.value) {
      URL.revokeObjectURL(filePreview.value);
      filePreview.value = null;
    }
    state.imageUrl = undefined;
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }

  onUnmounted(() => {
    if (filePreview.value) {
      URL.revokeObjectURL(filePreview.value);
    }
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    let imageUrlToSend = state.imageUrl || "";

    // If a file was selected, upload it first
    if (selectedFile.value) {
      isUploading.value = true;
      try {
        const formData = new FormData();
        formData.append("file", selectedFile.value);

        const uploadRes = await $fetch<{ url?: string; message?: string }>("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.url) {
          imageUrlToSend = uploadRes.url;
        } else {
          toast.add({
            title: "Erro no upload",
            description: uploadRes.message || "Não foi possível fazer upload da imagem",
            color: "error",
          });
          isUploading.value = false;
          return;
        }
      } catch (error: any) {
        const message = error?.data?.message || error?.statusMessage || "Não foi possível fazer upload da imagem";
        toast.add({
          title: "Erro no upload",
          description: message,
          color: "error",
        });
        isUploading.value = false;
        return;
      }
      isUploading.value = false;
    }

    // Submit event with the image URL
    const submitData = {
      data: {
        ...event.data,
        data: event.data.data ? new Date(event.data.data).getTime() : 0,
        imageUrl: imageUrlToSend,
      },
    };

    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify(submitData),
    });

    if (criar.statusCode === 200) {
      eventCreatedData.nome = criar.body.data.nome;
      eventCreatedData.data = criar.body.data.data;
      eventCreatedData.local = criar.body.data.local;
      eventCreatedData.descricao = criar.body.data.descricao;
      eventCreatedData.registranteNome = criar.body.data.registranteNome;
      eventCreatedData.registranteWhatsApp = criar.body.data.registranteWhatsApp;
      eventCreatedData.quantidadeMaxima = criar.body.data.quantidadeMaxima;
      eventCreatedData.linkPublico = criar.body.data.linkPublico;
      eventCreatedData.linkAdmin = criar.body.data.linkAdmin;
      eventCreatedData.imageUrl = criar.body.data.imageUrl;
      eventCreatedData.dataDaCriacao = criar.body.data.dataDaCriacao;
      eventCreatedData.id = criar.body.data.id;
      // Save to My Events
      myEvents.addEvent({
        adminId: criar.body.data.linkAdmin,
        publicId: criar.body.data.linkPublico,
        nome: criar.body.data.nome,
        data: criar.body.data.data,
      })
      eventCreated.value = true;
    }
  }

  function devButton() {
    state.evento = "Evento teste";
    state.data = "2022-12-31T23:59";
    state.local = "Local teste";
    state.descricao = "Venha celebrar com a gente!";
    state.registrante = "Fulano";
    state.registranteWhatsApp = "(99) 99999-9999";
    state.quantidadeMaxima = "112";
  }
</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <UCard>
    <template #header>
      <h1 class="md:text-2xl text-xl font-semibold">
        Crie seu evento ou compromisso (Grátis)
      </h1>
    </template>

    <UButton
      v-if="config.public.environment === 'development'"
      @click="devButton"
      class="mb-6"
      icon="i-heroicons-code-bracket"
      trailing
      >Dev</UButton
    >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Nome do evento" name="evento">
        <UInput
          v-model="state.evento"
          type="text"
          size="sm"
          icon="i-heroicons-newspaper"
          placeholder="Digite o nome do evento/compromisso"
        />
      </UFormGroup>

      <UFormGroup label="Local (opcional)" name="local">
        <UInput
          v-model="state.local"
          type="text"
          size="sm"
          icon="i-heroicons-home-solid"
          placeholder="Digite o local do evento/compromisso"
        />
      </UFormGroup>

      <div
        class="flex items-center flex-col justify-center md:flex-row gap-4 w-full"
      >
        <UFormGroup label="Seu nome" name="registrante" class="w-full">
          <UInput
            v-model="state.registrante"
            type="text"
            size="sm"
            icon="i-heroicons-user-circle-16-solid"
            placeholder="Digite seu nome"
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
          placeholder="Digite a quantidade máxima"
        />
      </UFormGroup>

      <UFormGroup label="Descrição (opcional)" name="descricao">
        <UTextarea
          v-model="state.descricao"
          size="sm"
          placeholder="Descreva seu evento..."
          :maxlength="1000"
          :rows="4"
        />
        <template #help>
          {{ (state.descricao || '').length }}/1000 caracteres
        </template>
      </UFormGroup>

      <UFormGroup label="Imagem para o evento (opcional)" name="imageUrl">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
        <div class="flex flex-col gap-3">
          <UButton
            @click="triggerFileInput"
            :icon="selectedFile ? 'i-heroicons-check-circle' : 'i-heroicons-photo-16-solid'"
            :color="selectedFile ? 'success' : 'primary'"
            trailing
            size="sm"
            class="text-sm font-semibold w-fit"
          >
            {{ selectedFile ? selectedFile.name : "Selecionar imagem" }}
          </UButton>
          <div v-if="selectedFile" class="flex items-center gap-3">
            <img
              v-if="filePreview"
              :src="filePreview"
              alt="Preview"
              class="w-24 h-24 object-cover rounded-md border"
            />
            <div class="flex flex-col gap-1">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ (selectedFile.size / 1024).toFixed(1) }} KB
              </span>
              <UButton
                @click="clearFile"
                icon="i-heroicons-x-circle"
                color="error"
                variant="ghost"
                size="xs"
              >
                Remover
              </UButton>
            </div>
          </div>
        </div>
      </UFormGroup>
      <div class="flex justify-center md:justify-start">
        <UButton
          type="submit"
          icon="i-heroicons-check-circle"
          size="xl"
          class="text-xl font-semibold mt-8"
          trailing
          :loading="isUploading"
          :disabled="isUploading"
        >
          {{ isUploading ? "Enviando imagem..." : "Criar Evento!" }}
        </UButton>
      </div>
    </UForm>

    <EventCreatedModal
      v-if="eventCreated"
      @update:eventCreated="eventCreated = $event"
      :eventCreated="eventCreated"
      :eventCreatedData="eventCreatedData"
      :appUrl="appUrl"
    />
  </UCard>
</template>
