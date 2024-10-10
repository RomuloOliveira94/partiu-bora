// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-30',
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/fonts",
    "@nuxthub/core",
  ],
  runtimeConfig: {
    environment: "production",
    tursoConnectionUrl: process.env.TURSO_DB_URL,
    tursoAuthToken: process.env.TURSO_DB_TOKEN, 
    public: {
      environment: "production",
      url: "",
      apiUrl: "",
    },
    nodeEnv: process.env.NODE_ENV,
  },
});