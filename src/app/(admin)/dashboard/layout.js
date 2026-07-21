import DashboardSidebar from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }) {
  const user = await requireUser();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar user={user} />

      <div className="flex flex-1 flex-col overflow-hidden pl-60">
        {children}
      </div>

      <Toaster />
    </div>
  );
}
