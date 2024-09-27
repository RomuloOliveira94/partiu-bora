<template>
  <div>
    teste
    <p>adminid: {{ adminid }}</p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  const route = useRoute();

  const adminid = ref(route.params.adminid);
</script>
