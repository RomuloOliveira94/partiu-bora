// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  app: {
    head: {
      htmlAttrs: {
        'data-color-mode-forced': 'light',
      },
    },
  },
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/fonts",
  ],
  ui: {
    colorMode: false, // Disable Nuxt UI colorMode module entirely
  },
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  runtimeConfig: {
    environment: "production",
    tursoConnectionUrl: process.env.TURSO_DB_URL,
    tursoAuthToken: process.env.TURSO_DB_TOKEN,
    public: {
      environment: "production",
      url: process.env.PUBLIC_URL!,
      apiUrl: "",
    },
    nodeEnv: process.env.NODE_ENV,
    r2PublicUrl: process.env.R2_PUBLIC_URL,
  },
  nitro: {
    routeRules: {
      "/api/upload": {
        bodySize: 5 * 1024 * 1024, // 5MB
      },
    },
  },
  image: {
    domains: [process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : ""],
  },
  // ogImage: {
  //   defaults: {
  //     emojis: "twemoji",
  //   },
  //   fonts: ["Belanosima"],
  // }
});
