<script setup lang="ts">
  const criarEvento = async () => {
    const criar = await $fetch("/api", {
      method: "POST",
      body: JSON.stringify({ evento: "teste" }),
    });
    console.log(criar);
  };

</script>

<template>
  <Head>
    <title>Home</title>
    <meta name="description" content="Home page" />
  </Head>
  <div>
    <UButton @click="criarEvento">Criar evento</UButton>
  </div>
</template>
