import { defineConfig } from "drizzle-kit";
let configuration;

//if (process.env.NODE_ENV === "production") {
configuration = defineConfig({
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DB_URL!,
    authToken: process.env.TURSO_DB_TOKEN!,
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
