
import { Skeleton } from "@/components/ui/skeleton";

export const ListingCardSkeleton = () => {
  return (
    <div className="kiwiiz-card overflow-hidden h-full flex flex-col">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/3 mt-4" />
      </div>
    </div>
  );
};
