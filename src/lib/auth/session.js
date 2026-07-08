import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

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

  return session.user;
}
