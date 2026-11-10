import {
  ClipboardList,
  Heart,
  HeartHandshake,
  LayoutDashboard,
  LifeBuoy,
  Receipt,
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
    ],
  },
];

export const userRoutes = donorRoutes;
