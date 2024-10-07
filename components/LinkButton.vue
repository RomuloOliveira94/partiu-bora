<template>
  <UButton
    size="sm"
    color="primary"
    variant="outline"
    class="w-fit h-full flex items-center gap-1 my-2"
    @click="handleGoToLink"
  >
    <strong>Ver</strong>
    <UIcon
      name="i-heroicons-arrow-top-right-on-square-16-solid"
      class="w-4 h-4"
    />
  </UButton>
</template>

<script setup lang="ts">
  const props = defineProps<{
    link: string;
  }>();
  const handleGoToLink = () => {
    window.open(props.link, "_blank");
  };
</script>

<style scoped></style>
