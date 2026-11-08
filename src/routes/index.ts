import { adminRoutes } from "./admin.routes";
import { volunteerRoutes } from "./volunteer.routes";
import { donorRoutes, userRoutes } from "./donor.routes";
import type { UserRole } from "@/types";

export * from "./admin.routes";
export * from "./volunteer.routes";
export * from "./donor.routes";

export function getRoutesByRole(role?: UserRole) {
  switch (role) {
    case "ADMIN":
      return adminRoutes;
    case "VOLUNTEER":
      return volunteerRoutes;
    case "DONOR":
      return donorRoutes;
    default:
      return adminRoutes;
  }
}
