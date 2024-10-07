<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import * as v from "valibot";
  const colorMode = useColorMode();
  const toast = useToast();
  const router = useRouter();
  const isDark = computed({
    get() {
      return colorMode.value === "dark";
    },
    set() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
  });

  const showEventSearch = ref(false);

  const schema = v.object({
    codigo: v.pipe(
      v.string("O código é obrigatório"),
      v.minLength(10, "O código deve ter no mínimo 10 caracteres"),
      v.maxLength(10, "O código deve ter no máximo 10 caracteres")
    ),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive({
    codigo: undefined,
  });
  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    console.log(event.data.codigo);
    const { body, status } = await $fetch(`/api/search/${event.data.codigo}`);

    if (status === 200) {
      const codigo =
        body.evento?.linkPublico === state.codigo
          ? body.evento?.linkPublico
          : `admin/${body.evento?.linkAdmin}`;
      router.push(`/evento/${codigo}`);
      showEventSearch.value = false;
    } else {
      toast.add({
        title: "Erro",
        description: "Evento não encontrado",
        icon: "i-noto:face-with-diagonal-mouth",
        timeout: 2000,
      });
      showEventSearch.value = false;
    }
  };
</script>

<template>
  <header class="border-b border-gray-200 border-opacity-10 bg-transparent">
    <div class="container mx-auto py-8 sm:px-6 sm:py-12 p-8">
      <div
        class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1
            class="text-2xl font-bold sm:text-3xl hover:text-primary cursor-pointer"
            @click="router.push('/')"
          >
            Partiu Bora?
          </h1>

          <p class="mt-1.5 text-sm">
            Organize um evento ou compromisso de forma simples e rápida, e
            convide seus amigos para participar.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <UButton
            size="lg"
            color="white"
            icon="i-heroicons-arrow-top-right-on-square-20-solid"
            class="rounded px-3 py-3 text-sm font-medium transition focus:outline-none focus:ring"
            @click="showEventSearch = true"
          >
            <span class="text-sm font-medium"> Já tenho um evento </span>
          </UButton>

          <UButton
            class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition focus:outline-none focus:ring"
            type="button"
          >
            <NuxtLink to="/">Criar um evento</NuxtLink>
          </UButton>
          <ClientOnly>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              color="gray"
              aria-label="Theme"
              class="fixed bottom-0 right-1 transform -translate-y-1/2"
              @click="isDark = !isDark"
              size="lg"
            />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
    <UModal v-model="showEventSearch">
      <UCard>
        <template #header>
          <h1 class="text-2xl font-bold">Código do evento</h1>
        </template>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="flex items-center flex-col gap-4 w-full">
            <UFormGroup label="Código" name="codigo" class="w-full">
              <UInput
                v-model="state.codigo"
                type="text"
                size="md"
                placeholder="Digite o nome código do evento"
                maxlength="10"
              />
            </UFormGroup>
          </div>
          <UButton type="submit" color="primary" size="lg" class="w-full">
            Buscar
          </UButton>
        </UForm>
      </UCard>
    </UModal>
  </header>
</template>
