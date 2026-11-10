import {
  BarChart3,
  Building2,
  HandHeart,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  PackageCheck,
  Siren,
  Truck,
  UserCheck,
  Users,
} from "lucide-react";

const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard Overview",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Analytics & Reports",
        url: `${prefix}/analytics`,
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "User Management",
        url: `${prefix}/users`,
        icon: Users,
      },
      {
        title: "Volunteer Management",
        url: `${prefix}/volunteers`,
        icon: HandHeart,
      },
      {
        title: "Rescue Request Management",
        url: `${prefix}/rescue-requests`,
        icon: LifeBuoy,
        badge: "Live",
        badgeClass: "bg-red-50 text-red-600 border border-red-200/80 font-bold",
      },
      {
        title: "Relief Need Management",
        url: `${prefix}/relief-needs`,
        icon: PackageCheck,
      },
      {
        title: "Shelter Management",
        url: `${prefix}/shelters`,
        icon: Building2,
      },
      {
        title: "Donation Management",
        url: `${prefix}/donations`,
        icon: HeartHandshake,
      },
      {
        title: "Relief Distribution Management",
        url: `${prefix}/distribution`,
        icon: Truck,
      },
      {
        title: "Campaign Management",
        url: `${prefix}/campaigns`,
        icon: Megaphone,
      },
    ],
  },
  {
    title: "System & Alerts",
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
        title: "My Profile",
        url: `${prefix}/profile`,
        icon: UserCheck,
      },
    ],
  },
];
