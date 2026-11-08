import RoleGuard from "@/components/auth/role-grud";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleGuard roles={["ADMIN"]}> <DashboardShell>{children} </DashboardShell></RoleGuard>;
}
