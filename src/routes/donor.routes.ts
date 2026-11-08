import {
  Bell,
  ClipboardList,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Receipt,
  Siren,
  UserRound,
} from "lucide-react";

const prefix = "/donor";

export const donorRoutes = [
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
    title: "Donations",
    items: [
      {
        title: "Browse Campaigns",
        url: `${prefix}/campaigns`,
        icon: Megaphone,
      },
      {
        title: "Make a Donation",
        url: `${prefix}/donate`,
        icon: HeartHandshake,
      },
      {
        title: "My Donations",
        url: `${prefix}/donations`,
        icon: Heart,
      },
      {
        title: "Donation History",
        url: `${prefix}/donation-history`,
        icon: ClipboardList,
      },
      {
        title: "Donation Receipts",
        url: `${prefix}/receipts`,
        icon: Receipt,
      },
    ],
  },
  {
    title: "Emergency & Support",
    items: [
      {
        title: "My Rescue Requests",
        url: `${prefix}/rescue-requests`,
        icon: LifeBuoy,
      },
      {
        title: "Emergency Alerts",
        url: `${prefix}/alerts`,
        icon: Siren,
        badge: "Live",
        badgeClass:
          "bg-red-50 text-red-600 border border-red-200/80 font-bold",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Notifications",
        url: `${prefix}/notifications`,
        icon: Bell,
      },
      {
        title: "My Profile",
        url: `${prefix}/profile`,
        icon: UserRound,
      },
    ],
  },
];

export const userRoutes = donorRoutes;
