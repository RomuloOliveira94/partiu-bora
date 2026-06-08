<script setup lang="ts">
  const route = useRoute();
  const config = useRuntimeConfig();
  const colorMode = useColorMode();

  // Force light mode: run BEFORE Nuxt UI's anti-FOUC script to prevent dark flash
  useHead({
    script: [
      {
        innerHTML: `
          (function() {
            document.documentElement.classList.remove('dark');
            try { localStorage.removeItem('nuxt-color-mode'); } catch(e) {}
            try { localStorage.removeItem('nuxt-ui-color-mode'); } catch(e) {}
          })();
        `,
        type: 'text/javascript',
        tagPriority: 'critical',
      },
    ],
  });

  // Belt: also force preference after hydration
  colorMode.preference = 'light';

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
