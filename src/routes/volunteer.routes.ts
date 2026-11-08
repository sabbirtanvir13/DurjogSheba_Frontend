
import {
  Activity,
  Bell,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  Siren,
  UserRound,
  Users,
} from "lucide-react";

const prefix = "/volunteer";

export const volunteerRoutes = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard Overview",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "My Activities",
    items: [
      {
        title: "Available Tasks",
        url: `${prefix}/available-tasks`,
        icon: ClipboardList,
      },
      {
        title: "My Assigned Tasks",
        url: `${prefix}/my-tasks`,
        icon: Clock,
      },
      {
        title: "Rescue Requests",
        url: `${prefix}/rescue-requests`,
        icon: LifeBuoy,
        badge: "Live",
        badgeClass:
          "bg-red-50 text-red-600 border border-red-200/80 font-bold",
      },
      {
        title: "Relief Operations",
        url: `${prefix}/relief-operations`,
        icon: Activity,
      },
      {
        title: "Nearby Shelters",
        url: `${prefix}/shelters`,
        icon: MapPin,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Emergency Alerts",
        url: `${prefix}/alerts`,
        icon: Siren,
        badge: "Urgent",
        badgeClass:
          "bg-amber-50 text-amber-700 border border-amber-200/80 font-bold",
      },
      {
        title: "Notifications",
        url: `${prefix}/notifications`,
        icon: Bell,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "My Profile",
        url: `${prefix}/profile`,
        icon: UserRound,
      },
      {
        title: "Activity History",
        url: `${prefix}/activity-history`,
        icon: Users,
      },
    ],
  },
];
