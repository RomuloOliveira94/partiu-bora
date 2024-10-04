// import { config } from "dotenv";
// config({ path: ".env" });
import { SqliteRemoteDatabase } from "drizzle-orm/sqlite-proxy";
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

import { drizzle as prodDrizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const config = useRuntimeConfig();
let sqlite;
let db: SqliteRemoteDatabase; 

if (config.environment === "production") {
  sqlite = createClient({
    url: config.tursoConnectionUrl,
    authToken: config.tursoAuthToken,
  });
  db = prodDrizzle(sqlite);
} else {
  sqlite = new Database("./server/db/sqlite.db");
  db = drizzle(sqlite);
}

export default db;
