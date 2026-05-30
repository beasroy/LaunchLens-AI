import { AppSidebar, MobileAppNav } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  userName?: string | null;
  userEmail?: string | null;
  className?: string;
};

export function AppShell({
  children,
  userName,
  userEmail,
  className,
}: AppShellProps) {
  return (
    <div className="gemini-mesh flex min-h-screen flex-col md:flex-row">
      <AppSidebar
        userName={userName}
        userEmail={userEmail}
        className="hidden md:flex"
      />
      <MobileAppNav userName={userName} />
      <div className={cn("flex min-h-screen min-w-0 flex-1 flex-col", className)}>
        {children}
      </div>
    </div>
  );
}
