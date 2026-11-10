import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-grud";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function DonorLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["DONOR", "ADMIN"]}>
      <DashboardShell userRole="DONOR">{children}</DashboardShell>
    </RoleGuard>
  );
}
