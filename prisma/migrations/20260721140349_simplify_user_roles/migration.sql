-- Remove the old enum default before changing the column type.
ALTER TABLE "user"
ALTER COLUMN "role" DROP DEFAULT;

-- Preserve existing users while reducing the role model.
-- Only explicitly marked ADMIN accounts become platform admins.
-- Every other legacy role becomes a normal user.
ALTER TABLE "user"
ALTER COLUMN "role" TYPE TEXT
USING (
  CASE
    WHEN "role"::text = 'ADMIN' THEN 'admin'
    ELSE 'user'
  END
);

-- All future users are normal users by default.
ALTER TABLE "user"
ALTER COLUMN "role" SET DEFAULT 'user';

-- The enum is no longer used.
DROP TYPE "UserRole";