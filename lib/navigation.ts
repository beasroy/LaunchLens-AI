import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Lightbulb } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export const coreNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & insights",
  },
  {
    href: "/ideas",
    label: "Ideas",
    icon: Lightbulb,
    description: "Validate startup concepts",
  },

];

export const landingNavItems: NavItem[] = [
  { href: "#how-it-works", label: "How it works", icon: LayoutDashboard },
  { href: "#features", label: "Features", icon: Lightbulb },
];
