<template>
  <div>
    teste

    <p>publicid: {{ publicid }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  const route = useRoute();

  const publicid = ref(route.params.publicid);
</script>

<style lang="scss" scoped></style>
