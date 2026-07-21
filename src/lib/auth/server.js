import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db/prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "development-only-change-this-photogallery-secret",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "user",
  },
  session: {
    modelName: "session",
  },
  account: {
    modelName: "account",
  },
  verification: {
    modelName: "verification",
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      bannedUserMessage:
        "Dein Benutzerkonto wurde gesperrt. Bitt wende dich an den Administrator.",
    }),
    nextCookies(),
  ],
});
