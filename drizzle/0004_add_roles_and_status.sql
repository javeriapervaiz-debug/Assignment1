-- Add role-based access control columns to users table
ALTER TABLE "users" 
ADD COLUMN "role" varchar(20) NOT NULL DEFAULT 'user',
ADD COLUMN "status" varchar(20) NOT NULL DEFAULT 'active',
ADD COLUMN "profile_image_url" varchar(500),
ADD COLUMN "last_login_at" timestamp,
ADD COLUMN "updated_at" timestamp DEFAULT now();

-- Update existing users to have default values
UPDATE "users" SET 
  "role" = 'user',
  "status" = 'active',
  "updated_at" = now()
WHERE "role" IS NULL;

-- Create an admin user (update this email to your email)
UPDATE "users" SET "role" = 'admin' WHERE "email" = 'your-admin-email@example.com';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" ("role");
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users" ("status");
CREATE INDEX IF NOT EXISTS "idx_users_last_login" ON "users" ("last_login_at");

-- Add comments for documentation
COMMENT ON COLUMN "users"."role" IS 'User role: user or admin';
COMMENT ON COLUMN "users"."status" IS 'User status: active, disabled, or pending';
COMMENT ON COLUMN "users"."last_login_at" IS 'Timestamp of last successful login';
