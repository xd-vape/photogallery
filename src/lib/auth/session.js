import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db/prisma";
import { canManageGalleries } from "@/lib/auth/permissions";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requirePhotographer() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !canManageGalleries(user)) {
    redirect("/login");
  }

  return user;
}
