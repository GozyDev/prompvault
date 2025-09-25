import { Prompt } from "@/lib/type";
import { lazy, Suspense } from "react";

const ExploreCard = lazy(() => import('./exploreCard'));

export function ExploreM({
  prompts,
  dbUserId,
}: {
  prompts: Prompt[];
  dbUserId: string;
}) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-6 gap-1 md:gap-3 max-w-full">
      {prompts.map((prompt) => (
        <Suspense key={prompt.id} fallback={<ExploreCardSkeleton />}>
          <ExploreCard prompt={prompt} dbUserId={dbUserId} />
        </Suspense>
      ))}
    </div>
  );
}

function ExploreCardSkeleton() {
  return (
    <div className="mb-3 break-inside-avoid rounded-2xl shadow-lg overflow-hidden relative bg-gray-200 animate-pulse">
      {/* This div mimics the image area */}
      <div className=" w-full aspect-square"></div>
    </div>
  );
}