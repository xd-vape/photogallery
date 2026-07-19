"use client";

import { cn } from "@/lib/utils";
import {
  Camera,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  Heart,
  HelpCircle,
  Images,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SignOutButton from "../SignOutButton";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getPlanLabel, getRoleLabel } from "@/lib/auth/permissions";
import { Users } from "lucide-react";
import { BookUser } from "lucide-react";
import { BarChart2 } from "lucide-react";
import { ServerCog } from "lucide-react";
import { Separator } from "../ui/separator";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Galleries", href: "/dashboard/galleries", icon: Images },
  { label: "Selections", href: "/dashboard/selections", icon: Heart },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const ADMIN_NAV = [
  { label: "Team", href: "/dashboard/admin/team", icon: Users },
  { label: "Kunden", href: "/dashboard/admin/clients", icon: BookUser },
  { label: "Statistiken", href: "/dashboard/admin/analytics", icon: BarChart2 },
  {
    label: "Server-Einstellungen",
    href: "/dashboard/admin/server-settings",
    icon: ServerCog,
  },
];

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const accesAdmin = ["OWNER", "ADMIN"].includes(user.role);

  const userInitials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  console.log(user.role);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground">
          <Camera className="h-3.5 w-3.5 text-background" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-foreground">
          Framelab
        </span>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto gap-0.5 px-3 py-4">
        <div className="flex flex-col gap-0.5">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-foreground/10 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-3 w-3 opacity-40" />}
              </Link>
            );
          })}
        </div>

        {accesAdmin && (
          <div className="mt-4">
            <Separator className="mb-4" />
            <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              Admin
            </p>
            <div>
              {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-foreground/10 text-foreground font-medium"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{label}</span>
                    {active && <ChevronRight className="size-3 opacity-40" />}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-foreground/5">
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-xs font-semibold bg-foreground/10 text-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {getRoleLabel(user?.role)}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {getPlanLabel(user?.subscriptionPlan)} Plan
              </p>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="start" className="w-56 mb-1">
            <div className="flex items-center gap-3 px-2 py-2 border-b border-border mb-1">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="text-xs font-semibold bg-foreground/10 text-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {getRoleLabel(user?.role)} ·{" "}
                  {getPlanLabel(user?.subscriptionPlan)}
                </p>
              </div>
            </div>

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <User className="size-3.5 text-muted-foreground" />
                Profil bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <CreditCard className="size-3.5 text-muted-foreground" />
                Abonnement & Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <HelpCircle className="size-3.5 text-muted-foreground" />
                Hilfe & Support
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
