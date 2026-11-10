import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-grud";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function VolunteerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["VOLUNTEER", "ADMIN"]}>
      <DashboardShell userRole="VOLUNTEER">{children}</DashboardShell>
    </RoleGuard>
  );
}
