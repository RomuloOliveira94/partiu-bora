<script setup lang="ts">
  const router = useRouter();
  const navigateHome = () => router.push("/");
  const { showEventSearch, state, schema, onSubmit } = useSearchEvent();
</script>
<template>
  <header class="border-b border-gray-200 border-opacity-10 bg-transparent">
    <div class="container mx-auto py-8 sm:px-6 sm:py-12 p-8">
      <div
        class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <Logo @navigate="navigateHome" />
          <div class="mt-6">
            <p class="mt-1.5 md:text-lg">
              Organize um evento ou compromisso de forma simples e rápida, e
              convide seus amigos para participar.
            </p>
            <p class="flex items-center gap-2 mt-2 md:text-lg">
              Compartilhe via:
              <UIcon name="logos:whatsapp-icon" class="w-8 h-8" />
              <UIcon name="logos:telegram" class="w-8 h-8" />
              <UIcon name="logos:facebook" class="w-8 h-8" />
              <UIcon name="logos:bluesky" class="w-8 h-8" />
            </p>
          </div>
        </div>

        <div class="flex items-center flex-wrap gap-4">
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
            v-if="router.currentRoute.value.path !== '/'"
          >
            <NuxtLink to="/">Criar um evento</NuxtLink>
          </UButton>
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
