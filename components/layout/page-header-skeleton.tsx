import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeaderSkeleton({
  descriptionWidth = "max-w-2xl",
}: {
  descriptionWidth?: string;
}) {
  return (
    <header className="border-b border-indigo-100/60 bg-white/50 px-6 py-8 backdrop-blur-sm lg:px-10">
      <Skeleton className="h-9 w-48" />
      <Skeleton className={cn("mt-3 h-5", descriptionWidth)} />
    </header>
  );
}
