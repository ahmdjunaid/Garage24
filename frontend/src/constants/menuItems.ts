import { Wrench, Home, Settings, Calendar, FileText, CalendarCheck, CheckCheck, UserRound, HandCoins } from "lucide-react";

type MenuItem = {
  name: string;
  path: string;
  icon: any;
  exact?: boolean;
};

const garageMenuItems = [
  { name: "Overview", path: "/garage", icon: Home, exact: true },
  { name: "Services", path: "/garage/services", icon: Settings },
  { name: "Mechanics", path: "/garage/mechanics", icon: Wrench },
  { name: "Appointments", path: "/garage/appointments", icon: Calendar },
  { name: "Reports", path: "/garage/reports", icon: FileText },
  { name: "Plans", path: "/garage/plans", icon: HandCoins },
];


const mechanicMenuItems = [
    { name: "Overview", path: "/mechanic", icon: Home, exact: true },
    { name: "Appointments", path: "/mechanic/appointments", icon: CheckCheck },
    { name: "Service Records", path: "/mechanic/service-records", icon: CalendarCheck },
    { name: "Reports", path: "/mechanic/reports", icon: FileText },
]

const superAdminMenuItems = [
    { name: "Overview", path: "/admin", icon: Home, exact: true },
    { name: "Garages", path: "/admin/garages", icon: Wrench },
    { name: "Users", path: "/admin/users", icon: UserRound },
    { name: "Reports", path: "/admin/reports", icon: FileText },
    { name: "Plans", path: "/admin/plans", icon: HandCoins },
]


export function getMenuItems(role: "garage" | "mechanic" | "admin"): MenuItem[] {
  switch (role) {
    case "garage":
      return garageMenuItems;
    case "mechanic":
      return mechanicMenuItems;
    case "admin":
      return superAdminMenuItems;
    default:
      return [];
  }
}