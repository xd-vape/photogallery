CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'PHOTOGRAPHER', 'VIEWER');

CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'STUDIO', 'ENTERPRISE');

CREATE TYPE "SubscriptionStatus" AS ENUM ('NONE', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');

ALTER TABLE "user"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'OWNER',
ADD COLUMN "subscriptionPlan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN "subscriptionCurrentPeriodEnd" TIMESTAMP(3),
ADD COLUMN "subscriptionProviderCustomerId" TEXT,
ADD COLUMN "subscriptionProviderSubscriptionId" TEXT;

CREATE INDEX "user_role_idx" ON "user"("role");

CREATE INDEX "user_subscriptionPlan_subscriptionStatus_idx" ON "user"("subscriptionPlan", "subscriptionStatus");
