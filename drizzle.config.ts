import * as dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "drizzle-kit";

const DATABASE_URL = (globalThis as any).process?.env?.DATABASE_URL as string | undefined;
console.log("DATABASE_URL:", DATABASE_URL);


export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
