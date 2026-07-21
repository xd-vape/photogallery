-- AlterTable
ALTER TABLE "session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE INDEX "session_impersonatedBy_idx" ON "session"("impersonatedBy");

-- CreateIndex
CREATE INDEX "user_banned_idx" ON "user"("banned");
