-- Add only the missing role-based access control columns
-- (profile_image_url already exists, so skip it)

-- Add role column (default: 'user')
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar(20) NOT NULL DEFAULT 'user';

-- Add status column (default: 'active' since existing users should be active)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" varchar(20) NOT NULL DEFAULT 'active';

-- Add last_login_at column
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login_at" timestamp;

-- Add updated_at column
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();

-- Update existing users to have proper values
UPDATE "users" SET 
  "role" = 'user',
  "status" = CASE 
    WHEN "email_verified_at" IS NOT NULL THEN 'active'
    ELSE 'pending'
  END,
  "updated_at" = now()
WHERE "role" IS NULL OR "status" IS NULL;

-- Make the first user an admin (replace with your email)
-- UPDATE "users" SET "role" = 'admin' WHERE "email" = 'your-email@example.com';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users" ("status");
CREATE INDEX IF NOT EXISTS "idx_users_last_login" ON "users" ("last_login_at");

-- Add comments for documentation
COMMENT ON COLUMN "users"."role" IS 'User role: user or admin';
COMMENT ON COLUMN "users"."status" IS 'User status: active, disabled, or pending';
COMMENT ON COLUMN "users"."last_login_at" IS 'Timestamp of last successful login';
