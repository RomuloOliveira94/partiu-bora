// // config({ path: ".env" });
// /* import { drizzle } from "drizzle-orm/better-sqlite3";
// import Database from "better-sqlite3"; */
// import { LibSQLDatabase, drizzle as prodDrizzle } from "drizzle-orm/libsql";
// import { createClient } from "@libsql/client";

// const { tursoConnectionUrl, tursoAuthToken } = useRuntimeConfig();

// let sqlite;
// let database: LibSQLDatabase | null = null;

// // if (config.environment === "production") {
// sqlite = createClient({
//   url: tursoConnectionUrl,
//   authToken: tursoAuthToken,
// });
// db = prodDrizzle(sqlite);
// // } else {
// //   sqlite = new Database("./server/db/sqlite.db");
// //   db = drizzle(sqlite);
// // }

// export default db;

import { createClient } from "@libsql/client/http";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

let db: LibSQLDatabase | null = null;

const { tursoConnectionUrl, tursoAuthToken } = useRuntimeConfig();

if (tursoAuthToken && tursoConnectionUrl) {
  db = drizzle(
    createClient({
      url: tursoConnectionUrl,
      authToken: tursoAuthToken,
    })
  );
}

export default db;
