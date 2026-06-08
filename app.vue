<script setup lang="ts">
  const config = useRuntimeConfig();
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
    <Header />
    <NuxtLayout>
      <div class="container mx-auto px-8 pt-2 pb-8 min-h-screen z-50">
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

  /* Black & white primary button overrides */
  .bg-primary-500 { background-color: #000 !important; color: #fff !important; }
  .hover\:bg-primary-600:hover { background-color: #1a1a1a !important; }
  .dark .bg-primary-500 { background-color: #fff !important; color: #000 !important; }
  .dark .hover\:bg-primary-600:hover { background-color: #e5e5e5 !important; }
</style>
