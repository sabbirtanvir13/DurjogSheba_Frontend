import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/types";
import { adminRoutes } from "./admin.routes";
import { donorRoutes } from "./donor.routes";
import { volunteerRoutes } from "./volunteer.routes";

export * from "./admin.routes";
export * from "./donor.routes";
export * from "./volunteer.routes";

export interface NavRouteItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  badgeClass?: string;
}

export interface NavRouteGroup {
  title: string;
  items: NavRouteItem[];
}

export function getRoutesByRole(role?: UserRole): NavRouteGroup[] {
  switch (role) {
    case "ADMIN":
      return adminRoutes as NavRouteGroup[];
    case "VOLUNTEER":
      return volunteerRoutes as NavRouteGroup[];
    case "DONOR":
      return donorRoutes as NavRouteGroup[];
    default:
      return adminRoutes as NavRouteGroup[];
  }
}
