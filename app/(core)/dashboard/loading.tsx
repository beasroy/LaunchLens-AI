import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { PageHeaderSkeleton } from "@/components/layout/page-header-skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <PageHeaderSkeleton />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <DashboardSkeleton />
      </div>
    </div>
  );
}
