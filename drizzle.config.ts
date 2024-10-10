import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

let configuration;

//if (process.env.NODE_ENV === "production") {
configuration = defineConfig({
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.NUXT_TURSO_CONNECTION_URL || "",
    authToken: process.env.NUXT_TURSO_AUTH_TOKEN || "",
  },
});
// } else {
//   configuration = defineConfig({
//     schema: "./server/db/schema.ts",
//     out: "./drizzle",
//     dialect: "sqlite",
//     dbCredentials: {
//       url: "./server/db/sqlite.db",
//     },
//   });
// }

export default configuration;
