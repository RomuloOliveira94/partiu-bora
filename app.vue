<script setup lang="ts">
  const config = useRuntimeConfig();

  useSeoMeta({
    title: "Partiu Bora?",
    description:
      "Organize seus eventos de forma simples e rápida, e convide seus amigos para participar.",
    ogTitle: "Partiu Bora?",
    ogDescription:
      "Organize seus eventos de forma simples e rápida, e convide seus amigos para participar.",
    ogImage: config.public.url + "/images/partiu.webp",
    twitterImage: config.public.url + "/images/partiu.webp",
    twitterCard: "summary_large_image",
  });
</script>

<template>
  <div class="relative">
    <NuxtLoadingIndicator />
    <Header />
    <NuxtLayout>
      <div class="container mx-auto p-8 min-h-screen z-50">
        <NuxtPage />
      </div>
      <UNotifications />
    </NuxtLayout>
    <ThemeButton />
  </div>
</template>

<style>
  div {
    font-family: Belanosima, sans-serif;
  }
</style>
