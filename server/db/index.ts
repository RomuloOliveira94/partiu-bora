import { createClient } from "@libsql/client/http";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

let db: LibSQLDatabase;

const { tursoConnectionUrl, tursoAuthToken } = useRuntimeConfig();

db = drizzle(
  createClient({
    url: tursoConnectionUrl,
    authToken: tursoAuthToken,
  })
);

export default db;
