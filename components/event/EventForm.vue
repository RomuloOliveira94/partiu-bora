<script setup lang="ts">
  import { onUnmounted, computed } from "vue";
  import type { FormSubmitEvent } from "#ui/types";
  import { vMaska } from "maska/vue";
  import * as v from "valibot";

  const props = withDefaults(defineProps<{
    mode: "create" | "edit";
    initialData?: {
      nome?: string;
      local?: string;
      descricao?: string;
      data?: number;
      quantidadeMaxima?: string | number;
      registrante?: string;
      registranteWhatsApp?: string;
      imageUrl?: string;
    };
    submitLabel?: string;
  }>(), {
    initialData: () => ({}),
  });

  const emit = defineEmits<{
    submit: [data: any];
  }>();

  const toast = useToast();

  const selectedFile = ref<File | null>(null);
  const filePreview = ref<string | null>(null);
  const isUploading = ref(false);
  const fileInputRef = ref<HTMLInputElement | null>(null);

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  // Schema: registrante/registranteWhatsApp optional on edit
  const createSchema = v.object({
    evento: v.string("O nome do evento é obrigatório."),
    data: v.string("A data do evento é obrigatória."),
    local: v.optional(v.string()),
    descricao: v.optional(v.pipe(v.string(), v.maxLength(1000, "Descrição deve ter no máximo 1000 caracteres"))),
    quantidadeMaxima: v.optional(v.string()),
    registrante: v.string("O seu nome é obrigatório."),
    registranteWhatsApp: v.string("O seu WhatsApp é obrigatório."),
    imageUrl: v.optional(v.string()),
  });

  const editSchema = v.object({
    evento: v.string("O nome do evento é obrigatório."),
    data: v.string("A data do evento é obrigatória."),
    local: v.optional(v.string()),
    descricao: v.optional(v.pipe(v.string(), v.maxLength(1000, "Descrição deve ter no máximo 1000 caracteres"))),
    quantidadeMaxima: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  });

  const schema = computed(() => props.mode === "edit" ? editSchema : createSchema);
  type Schema = v.InferOutput<typeof schema.value>;

  const state = reactive({
    evento: props.initialData.nome ?? undefined,
    local: props.initialData.local ?? undefined,
    data: props.initialData.data ? epochToDatetimeLocal(props.initialData.data) : undefined,
    descricao: props.initialData.descricao ?? undefined,
    quantidadeMaxima: props.initialData.quantidadeMaxima?.toString() ?? undefined,
    registrante: props.mode === "create" ? (props.initialData.registrante ?? undefined) : undefined,
    registranteWhatsApp: props.mode === "create" ? (props.initialData.registranteWhatsApp ?? undefined) : undefined,
    imageUrl: props.initialData.imageUrl ?? undefined,
  });

  function epochToDatetimeLocal(epoch: number): string {
    const date = new Date(epoch);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  }

  function triggerFileInput() {
    fileInputRef.value?.click();
  }

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.add({ title: "Tipo de arquivo não suportado", description: "Use JPEG, PNG, WebP ou GIF", color: "error" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.add({ title: "Imagem muito grande", description: "O tamanho máximo é 3MB", color: "error" });
      return;
    }

    selectedFile.value = file;
    filePreview.value = URL.createObjectURL(file);
    state.imageUrl = undefined;
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
    if (filePreview.value) URL.revokeObjectURL(filePreview.value);
  });

  async function onSubmit(event: FormSubmitEvent<Schema>) {
    let imageUrlToSend = state.imageUrl || props.initialData?.imageUrl || "";

    if (selectedFile.value) {
      isUploading.value = true;
      try {
        const formData = new FormData();
        formData.append("file", selectedFile.value);
        const uploadRes = await $fetch<{ url?: string; message?: string }>("/api/upload", { method: "POST", body: formData });
        if (uploadRes.url) {
          imageUrlToSend = uploadRes.url;
        } else {
          toast.add({ title: "Erro no upload", description: uploadRes.message || "Não foi possível fazer upload da imagem", color: "error" });
          isUploading.value = false;
          return;
        }
      } catch (error: any) {
        const message = error?.data?.message || error?.statusMessage || "Não foi possível fazer upload da imagem";
        toast.add({ title: "Erro no upload", description: message, color: "error" });
        isUploading.value = false;
        return;
      }
      isUploading.value = false;
    }

    const submitData = {
      data: {
        ...event.data,
        imageUrl: imageUrlToSend,
      },
    };

    emit("submit", submitData);
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
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UButton v-if="mode === 'create'" @click="devButton" class="mb-6" icon="i-heroicons-code-bracket" trailing>Dev</UButton>

    <UFormGroup label="Nome do evento" name="evento">
      <UInput v-model="state.evento" type="text" size="sm" icon="i-heroicons-newspaper" placeholder="Digite o nome do evento/compromisso" />
    </UFormGroup>

    <UFormGroup label="Local (opcional)" name="local">
      <UInput v-model="state.local" type="text" size="sm" icon="i-heroicons-home-solid" placeholder="Digite o local do evento/compromisso" />
    </UFormGroup>

    <div v-if="mode === 'create'" class="flex items-center flex-col justify-center md:flex-row gap-4 w-full">
      <UFormGroup label="Seu nome" name="registrante" class="w-full">
        <UInput v-model="state.registrante" type="text" size="sm" icon="i-heroicons-user-circle-16-solid" placeholder="Digite seu nome" />
      </UFormGroup>
      <UFormGroup label="Seu WhatsApp" name="registranteWhatsApp" class="w-full">
        <UInput v-model="state.registranteWhatsApp" type="tel" size="sm" icon="i-heroicons-phone" v-maska="'(##) #####-####'" placeholder="(99) 99999-9999" />
      </UFormGroup>
    </div>

    <UFormGroup label="Data e Hora" name="data">
      <UInput v-model="state.data" type="datetime-local" size="sm" icon="i-heroicons-calendar-days" />
    </UFormGroup>

    <UFormGroup label="Quantidade de Convidados (opcional)" name="quantidadeMaxima">
      <UInput v-model="state.quantidadeMaxima" type="text" size="sm" icon="i-heroicons-user-group-solid" v-maska="'######'" placeholder="Digite a quantidade máxima" />
    </UFormGroup>

    <UFormGroup label="Descrição (opcional)" name="descricao">
      <UTextarea v-model="state.descricao" size="sm" placeholder="Descreva seu evento..." :maxlength="1000" :rows="4" />
      <template #help>{{ (state.descricao || '').length }}/1000 caracteres</template>
    </UFormGroup>

    <UFormGroup label="Imagem para o evento (opcional)" name="imageUrl">
      <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
      <div class="flex flex-col gap-3">
        <UButton @click="triggerFileInput" :icon="selectedFile ? 'i-heroicons-check-circle' : 'i-heroicons-photo-16-solid'" :color="selectedFile ? 'success' : 'primary'" trailing size="sm" class="text-sm font-semibold w-fit">
          {{ selectedFile ? selectedFile.name : (initialData?.imageUrl ? "Alterar imagem" : "Selecionar imagem") }}
        </UButton>
        <div v-if="selectedFile" class="flex items-center gap-3">
          <img v-if="filePreview" :src="filePreview" alt="Preview" class="w-24 h-24 object-cover rounded-md border" />
          <div class="flex flex-col gap-1">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ (selectedFile.size / 1024).toFixed(1) }} KB</span>
            <UButton @click="clearFile" icon="i-heroicons-x-circle" color="error" variant="ghost" size="xs">Remover</UButton>
          </div>
        </div>
        <div v-else-if="initialData?.imageUrl && !selectedFile" class="flex items-center gap-3">
          <img :src="initialData.imageUrl" alt="Imagem atual" class="w-24 h-24 object-cover rounded-md border" />
          <span class="text-sm text-gray-500">Imagem atual</span>
        </div>
      </div>
    </UFormGroup>

    <div class="flex justify-center md:justify-start">
      <UButton type="submit" icon="i-heroicons-check-circle" size="xl" class="text-xl font-semibold mt-8" trailing :loading="isUploading" :disabled="isUploading">
        {{ isUploading ? "Enviando imagem..." : (submitLabel || (mode === 'create' ? 'Criar Evento!' : 'Salvar Alterações')) }}
      </UButton>
    </div>
  </UForm>
</template>
