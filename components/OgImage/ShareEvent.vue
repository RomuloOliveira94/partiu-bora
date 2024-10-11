<script lang="ts" setup>
  defineProps<{
    title: string;
    date: string;
    user?: string;
    local?: string;
  }>();
</script>
<template>
  <div style="font-family: 'belanosima'" class="grid gap-8 p-16 h-full w-full">
    <h1
      class="text-8xl font-bold sm:text-3xl hover:text-primary cursor-pointer tw-flex tw-items-center tw-gap-2"
    >
      Partiu Bora? 👋
    </h1>
    <div class="grid font-semibold">
      <p class="text-6xl">
        {{ title.slice(0, 35) }}
        {{ title.length > 35 ? "..." : "" }}
      </p>
      <p class="text-6xl">
        {{ date }}
      </p>
      <p v-if="user" class="text-4xl font-medium">Criado por: {{ user }}</p>
    </div>
  </div>
</template>

<style></style>
