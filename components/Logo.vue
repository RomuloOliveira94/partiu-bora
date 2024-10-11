<template>
  <h1
    class="text-2xl font-bold sm:text-3xl hover:text-primary cursor-pointer tw-flex tw-items-center tw-gap-2"
    @click="emit('navigate')"
  >
    <UIcon name="emojione:waving-hand" />
    Partiu Bora?
  </h1>
</template>

<script setup>
  const emit = defineEmits(["navigate"]);
</script>
