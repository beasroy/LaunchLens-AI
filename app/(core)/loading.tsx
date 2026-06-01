import { GenericPageSkeleton } from "@/components/layout/generic-page-skeleton";
import { PageHeaderSkeleton } from "@/components/layout/page-header-skeleton";

export default function CoreLoading() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <PageHeaderSkeleton />
      <div className="flex-1 px-6 py-8 lg:px-10">
        <GenericPageSkeleton />
      </div>
    </div>
  );
}
