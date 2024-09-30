<script setup>
  const colorMode = useColorMode();
  const isDark = computed({
    get() {
      return colorMode.value === "dark";
    },
    set() {
      colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
    },
  });
</script>

<template>
  <header class="border-b border-gray-200 border-opacity-10 bg-transparent">
    <div class="container mx-auto py-8 sm:px-6 sm:py-12 p-8">
      <div
        class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="text-2xl font-bold sm:text-3xl">Partiu Bora?</h1>

          <p class="mt-1.5 text-sm">
            Organize seus eventos de forma simples e rápida, e convide seus
            amigos para participar.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <UButton
            size="lg"
            color="white"
            icon="i-heroicons-arrow-top-right-on-square-20-solid"
            class="rounded px-3 py-3 text-sm font-medium transition focus:outline-none focus:ring"
          >
            <span class="text-sm font-medium"> Já tenho um evento </span>
          </UButton>

          <UButton
            class="inline-block rounded px-3 py-3 text-sm font-medium text-white transition focus:outline-none focus:ring"
            type="button"
          >
            Criar um evento
          </UButton>
          <ClientOnly>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </header>
</template>
