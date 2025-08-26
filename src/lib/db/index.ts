// src/lib/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { env } from "$env/dynamic/private";

const { Pool } = pkg;

const connectionString = env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Create auth-app/.env with DATABASE_URL=postgres://user:pass@host:5432/db");
}

const pool = new Pool({
  connectionString
});

export const db = drizzle(pool);
