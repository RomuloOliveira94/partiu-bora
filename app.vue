<script setup lang="ts">
  useSeoMeta({
    title: "Partiu Bora?",
    description:
      "Organize seus eventos de forma simples e rápida, e convide seus amigos para participar.",
    ogTitle: "Partiu Bora?",
    ogDescription:
      "Organize seus eventos de forma simples e rápida, e convide seus amigos para participar.",
    ogImage: "/og-image.png",
    twitterCard: "summary_large_image",
  });
</script>

<template>
  <div>
    <Header />
    <NuxtLayout>
      <div class="container mx-auto p-8">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
