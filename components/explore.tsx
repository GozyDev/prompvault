import { Prompt } from "@/lib/type";

import { ExploreCard } from "./exploreCard";

export function ExploreM({
  prompts,
  dbUserId,
}: {
  prompts: Prompt[];
  dbUserId: string;
}) {
  console.log(prompts);

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-1 md:gap-3">
      {prompts.map((prompt) => (
        <ExploreCard key={prompt.id} prompt={prompt} dbUserId={dbUserId} />
      ))}
    </div>
  );
}
