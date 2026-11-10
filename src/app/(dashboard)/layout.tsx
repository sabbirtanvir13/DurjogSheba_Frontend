import type { ReactNode } from "react";
import { AuthGrud } from "@/components/auth/auth-grud";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AuthGrud>{children}</AuthGrud>
    </div>
  );
}
