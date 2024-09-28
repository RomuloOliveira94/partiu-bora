<template>
  <div>
    <h1>Counter: {{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="criarEvento">Criar evento</button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const count = ref(0);

  const increment = () => {
    count.value++;
  };

  const criarEvento = async () => {
    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify({ evento: "teste" }),
    });
    console.log(criar);
  };
</script>

<style lang="scss" scoped></style>
