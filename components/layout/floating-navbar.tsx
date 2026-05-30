"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { coreNavItems, landingNavItems, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export type FloatingNavbarProps = {
  variant?: "landing" | "core";
  items?: NavItem[];
  userName?: string | null;
  userEmail?: string | null;
  showAuth?: boolean;
  className?: string;
};

export function FloatingNavbar({
  variant = "landing",
  items,
  userName,
  userEmail,
  showAuth = variant === "landing",
  className,
}: FloatingNavbarProps) {
  const pathname = usePathname();
  const navItems = items ?? (variant === "core" ? coreNavItems : landingNavItems);

  return (
    <header className={cn("sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8", className)}>
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 shadow-lg shadow-indigo-500/5 backdrop-blur-xl",
          "gemini-card-glow"
        )}
      >
        <Link href={variant === "core" ? "/ideas" : "/"} className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl gemini-btn-gradient">
            <Sparkles className="size-4 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight gemini-gradient-text">
            LaunchLens
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isHash = href.startsWith("#");
            const active =
              !isHash &&
              (pathname === href || pathname.startsWith(`${href}/`));
            const linkClass = cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-indigo-50 text-indigo-700"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            );

            if (isHash) {
              return (
                <a key={href} href={href} className={linkClass}>
                  <Icon className="size-4" />
                  {label}
                </a>
              );
            }

            return (
              <Link key={href} href={href} className={linkClass}>
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {variant === "core" && (
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-none">
                {userName ?? "Founder"}
              </p>
              {userEmail ? (
                <p className="mt-0.5 max-w-[160px] truncate text-xs text-muted-foreground">
                  {userEmail}
                </p>
              ) : null}
            </div>
          )}

          {showAuth && variant === "landing" ? (
            <>
              <Button variant="ghost" className="hidden rounded-xl sm:inline-flex" asChild>
                <Link href="/auth">Sign in</Link>
              </Button>
              <Button className="rounded-xl gemini-btn-gradient" asChild>
                <Link href="/auth">Get started</Link>
              </Button>
            </>
          ) : null}

          {variant === "core" ? (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="rounded-xl border-indigo-100 bg-white/80"
              aria-label="Sign out"
              onClick={() => signOut({ callbackUrl: "/auth" })}
            >
              <LogOut className="size-4" />
            </Button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
