import DashboardSidebar from "@/components/dashboard/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { requireUser } from "@/lib/auth/session";
import { toSidebarUserDto } from "@/lib/dto/user";

export default async function DashboardLayout({ children }) {
  const user = await requireUser();
  const sidebarUser = toSidebarUserDto(user);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar user={sidebarUser} />

      <div className="flex flex-1 flex-col overflow-hidden pl-60">
        {children}
      </div>

      <Toaster />
    </div>
  );
}
