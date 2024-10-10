// config({ path: ".env" });
/* import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3"; */

import { drizzle as prodDrizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const { tursoConnectionUrl, tursoAuthToken } = useRuntimeConfig();

let sqlite;
let db: any;

// if (config.environment === "production") {
sqlite = createClient({
  url: tursoConnectionUrl,
  authToken: tursoAuthToken,
});
db = prodDrizzle(sqlite);
// } else {
//   sqlite = new Database("./server/db/sqlite.db");
//   db = drizzle(sqlite);
// }

export default db;
