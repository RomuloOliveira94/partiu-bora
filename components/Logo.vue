<template>
  <div
    class="hover:text-primary cursor-pointer tw-flex tw-items-center tw-gap-2"
    @click="emit('navigate')"
  >
    <ClientOnly>
      <img :src="logoSrc" alt="Partiu Bora?" class="h-44 w-auto object-contain" />
      <template #fallback>
        <div class="h-44 w-auto" />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
  const colorMode = useColorMode();
  const emit = defineEmits(["navigate"]);

  const logoSrc = computed(() => {
    return colorMode.value === "dark"
      ? "/partiuboralogodark.png"
      : "/partiuboralogolight.png";
  });
</script>
