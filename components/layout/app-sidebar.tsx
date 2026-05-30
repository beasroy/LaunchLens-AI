"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { coreNavItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  userName?: string | null;
  userEmail?: string | null;
  className?: string;
};

export function AppSidebar({ userName, userEmail, className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 shrink-0 flex-col border-r border-indigo-100/80 bg-white/80 backdrop-blur-xl md:sticky md:top-0 lg:w-72",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-indigo-100/60 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-xl gemini-btn-gradient">
          <Sparkles className="size-5 text-white" />
        </span>
        <div>
          <p className="text-lg font-semibold leading-tight gemini-gradient-text">
            LaunchLens
          </p>
          <p className="text-xs text-muted-foreground">Idea validation</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        {coreNavItems.map(({ href, label, icon: Icon, description }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 size-5 shrink-0",
                  active ? "text-indigo-600" : "text-muted-foreground"
                )}
              />
              <span>
                <span className="block text-sm font-medium">{label}</span>
                {description ? (
                  <span className="mt-0.5 block text-xs opacity-80">
                    {description}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-indigo-100/60 p-4">
        <div className="mb-3 rounded-xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-rose-50/50 px-3 py-3">
          <p className="truncate text-sm font-medium text-foreground">
            {userName ?? "Founder"}
          </p>
          {userEmail ? (
            <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl border-indigo-100"
          onClick={() => signOut({ callbackUrl: "/auth" })}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}

type MobileAppNavProps = {
  userName?: string | null;
};

export function MobileAppNav({ userName }: MobileAppNavProps) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-3 border-b border-indigo-100/80 bg-white/90 px-4 py-3 backdrop-blur-xl md:hidden">
      <Link href="/ideas" className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg gemini-btn-gradient">
          <Sparkles className="size-3.5 text-white" />
        </span>
        <span className="font-semibold gemini-gradient-text">LaunchLens</span>
      </Link>
      <nav className="flex flex-1 items-center justify-center gap-1">
        {coreNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Sign out ${userName ?? ""}`}
        onClick={() => signOut({ callbackUrl: "/auth" })}
      >
        <LogOut className="size-4" />
      </Button>
    </header>
  );
}
