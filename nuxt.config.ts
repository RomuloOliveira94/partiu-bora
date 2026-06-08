// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-30",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@nuxt/fonts",
  ],
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
    // R2 config
    r2AccountId: process.env.R2_ACCOUNT_ID,
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    r2BucketName: process.env.R2_BUCKET_NAME,
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
