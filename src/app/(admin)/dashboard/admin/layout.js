import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({ children }) {
  await requireAdmin();

  return children;
}
