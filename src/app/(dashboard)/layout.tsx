import { AuthGrud } from "@/components/auth/auth-grud";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
     <AuthGrud>
      {children}
     </AuthGrud>

    
 
    </div>
  );
}
