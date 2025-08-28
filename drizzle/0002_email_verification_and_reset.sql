ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "email_verified_at" timestamp,
  ADD COLUMN IF NOT EXISTS "verification_token" varchar(255),
  ADD COLUMN IF NOT EXISTS "reset_token" varchar(255),
  ADD COLUMN IF NOT EXISTS "reset_expires" timestamp;

