import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import { DashboardSidebar } from "./dashboard-sidebar";

export interface DashboardShellProps {
  children: ReactNode;
  userRole?: UserRole;
  role?: UserRole;
}

export function DashboardShell({
  children,
  userRole,
  role,
}: DashboardShellProps) {
  const activeRole = userRole || role;

  return (
    <SidebarProvider>
      <DashboardSidebar userRole={activeRole} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <span className="text-sm font-semibold text-slate-700">
              {activeRole
                ? `${activeRole.charAt(0) + activeRole.slice(1).toLowerCase()} Workspace`
                : "Workspace"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-slate-50/50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardShell;
