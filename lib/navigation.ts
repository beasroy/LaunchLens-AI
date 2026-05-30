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
    href: "/ideas",
    label: "Ideas",
    icon: Lightbulb,
    description: "Validate startup concepts",
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & insights",
  },
];

export const landingNavItems: NavItem[] = [
  { href: "#features", label: "Features", icon: Lightbulb },
  { href: "/auth", label: "Sign in", icon: LayoutDashboard },
];
