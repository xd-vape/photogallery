import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db/prisma";

import { hasRole, isAdmin, USER_ROLES } from "@/lib/auth/permissions";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
}

function hasApplicationAccess(user) {
  return hasRole(user, USER_ROLES.USER) || isAdmin(user);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user || !hasApplicationAccess(user)) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!isAdmin(user)) {
    redirect("/dashboard");
  }

  return user;
}
