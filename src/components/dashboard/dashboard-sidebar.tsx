"use client";

import { ExternalLink, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { toast } from "react-toastify";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { getRoutesByRole } from "@/routes";
import type { UserRole } from "@/types";

export interface DashboardSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  userRole?: UserRole;
  role?: UserRole;
}

export function DashboardSidebar({
  userRole,
  role: roleProp,
  ...props
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data } = useGetMe();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const user = data?.data ?? data;
  const currentRole = userRole || roleProp || user?.role || "ADMIN";
  const navGroups = getRoutesByRole(currentRole);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
      },
      onError: (err: unknown) => {
        const apiErr = err as { data?: { message?: string }; message?: string };
        toast.error(
          apiErr?.data?.message || apiErr?.message || "Logout failed",
        );
      },
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border/60 p-4">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-95"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 p-1.5 ring-1 ring-green-600/20 shadow-xs">
            <Image
              src="/Logo.png"
              alt="Durjog Sheba"
              width={36}
              height={36}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-900">
                Durjog Sheba
              </span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                {currentRole}
              </span>
            </div>
            <span className="font-[family-name:var(--font-bengali)] text-[11px] font-semibold text-green-700">
              দুর্যোগ সেবা
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2.5 py-3">
        {navGroups.map((group) => (
          <SidebarGroup key={group.title} className="p-0 mb-4 last:mb-1">
            <SidebarGroupLabel className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {group.items.map((item) => {
                  const isActive =
                    item.url !== "#" &&
                    (pathname === item.url ||
                      (item.url !== "/admin" &&
                        item.url !== "/volunteer" &&
                        item.url !== "/donor" &&
                        pathname.startsWith(`${item.url}/`)));

                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.title}
                        render={<Link href={item.url} />}
                        className={cn(
                          "relative flex items-center gap-2.5 rounded-lg px-3 py-2.5 min-h-[38px] text-xs font-medium transition-all duration-150",
                          isActive
                            ? "bg-green-700 font-semibold text-white shadow-xs hover:bg-green-800 hover:text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            isActive ? "text-white" : "text-slate-500",
                          )}
                        />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>

                      {item.badge && (
                        <SidebarMenuBadge
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] group-data-[collapsible=icon]:hidden",
                            item.badgeClass,
                          )}
                        >
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="my-1" />

      <SidebarFooter className="p-3">
        <SidebarMenu className="gap-1.5">
          {/* Quick link to live site */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="View Live Website"
              render={<Link href="/" target="_blank" />}
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-xs py-2 min-h-[36px]"
            >
              <ExternalLink className="h-4 w-4 shrink-0 text-slate-500" />
              <span>View Live Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Profile / Logout */}
          <SidebarMenuItem>
            <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 group-data-[collapsible=icon]:p-1.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-700 text-xs font-bold text-white shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-[10px] text-slate-500">
                    {user?.email || "user@durjogsheba.org"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutPending}
                title="Log out"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group-data-[collapsible=icon]:hidden"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default DashboardSidebar;
