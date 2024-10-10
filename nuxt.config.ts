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
    environment: "",
    tursoConnectionUrl: "",
    tursoAuthToken:"", 
    public: {
      environment: "",
      url: "",
      apiUrl: "",
    }
  },
});