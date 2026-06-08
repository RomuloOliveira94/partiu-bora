<script setup lang="ts">
  const route = useRoute();
  const config = useRuntimeConfig();

  const isGuestEventPage = computed(
    () => route.path.startsWith("/evento/") && !route.path.includes("/admin/")
  );
  useSeoMeta({
    title: "Partiu Bora?",
    description:
      "Organize seus eventos de forma simples e rápida, e convide seus amigos para participar.",
    ogTitle: "Partiu Bora?",
    ogImage: config.public.url + "/images/og-image.png",
    ogDescription:
      "Organize seus eventos de forma simples e rápida, e convide seus amigos para participar.",
    ogUrl: config.public.url,
    twitterCard: "summary_large_image",
  });

  // defineOgImageComponent("NuxtSeo", {
  //   title: "Partiu Bora? 👋",
  //   description:
  //     "Organize seus eventos ou compromissos de forma simples e rápida, e convide seus amigos para participar.",
  //   theme: "#96B6FF",
  //   colorMode: "light",
  // });
</script>

<template>
  <div class="relative">
    <NuxtLoadingIndicator />
    <Header v-if="!isGuestEventPage" />
    <NuxtLayout>
      <div class="container mx-auto px-4 md:px-8 pt-2 pb-8 min-h-screen z-50">
        <NuxtPage />
      </div>
      <UNotifications />
    </NuxtLayout>
  </div>
</template>

<style>
  div {
    font-family: Belanosima, sans-serif;
  }

  .bg-primary-500 {
    background-color: #000 !important;
    color: #fff !important;
  }

  .hover\:bg-primary-600:hover {
    background-color: #1a1a1a !important;
  }
</style>
