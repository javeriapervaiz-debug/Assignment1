-- Drop the incorrect columns from users table
ALTER TABLE "users" 
  DROP COLUMN IF EXISTS "verification_token",
  DROP COLUMN IF EXISTS "reset_token",
  DROP COLUMN IF EXISTS "reset_expires";

-- Create the verification_tokens table
CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "token" varchar(255) NOT NULL UNIQUE,
  "expires" timestamp NOT NULL,
  "type" varchar(50) NOT NULL,
  CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- Add missing columns to users table
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "first_name" varchar(120),
  ADD COLUMN IF NOT EXISTS "last_name" varchar(120);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS "verification_tokens_token_idx" ON "verification_tokens"("token");
CREATE INDEX IF NOT EXISTS "verification_tokens_user_id_idx" ON "verification_tokens"("user_id");
