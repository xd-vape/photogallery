import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db/prisma";
import { admin } from "better-auth/plugins";
import { getServerEnv } from "../config/server-env";

const environment = getServerEnv();

export const auth = betterAuth({
  secret: environment.BETTER_AUTH_SECRET,
  baseURL: environment.BETTER_AUTH_URL,
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
        "Dein Benutzerkonto wurde gesperrt. Bitte wende dich an den Administrator.",
    }),
    nextCookies(),
  ],
});
