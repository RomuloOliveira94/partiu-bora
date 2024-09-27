import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "./schema";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

