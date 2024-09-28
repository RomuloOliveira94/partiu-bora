<script setup lang="ts">
  import { ref } from "vue";
  const route = useRoute();

  const publicid = ref(route.params.publicid);

  useSeoMeta({
    title: "Evento",
    description: `Página do evento ${publicid.value}`,
  });
</script>

<template>
  <div>
    teste

    <p>publicid: {{ publicid }}</p>
  </div>
</template>
