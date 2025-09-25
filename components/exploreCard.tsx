import { Heart } from "lucide-react";

import { Prompt } from "@/lib/type";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { usePromptStore } from "@/stores/usePromptStore";
import { useState } from "react";
import PopOver from "./PopOver";

export default function ExploreCard({
  prompt,
  dbUserId,
}: {
  prompt: Prompt;
  dbUserId: string;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const { prompts, updatePrompt } = usePromptStore();
  const [isLiking, setIsLiking] = useState(false);
  const promptData = prompts.find((p) => p.id === prompt.id) || prompt;
  const hasLiked = promptData.favorites.some((fav) => fav.userId === dbUserId);
  const likeCount = promptData._count.favorites;
  // console.log("userID", dbUserId);
  // console.log(hasLiked);

  const handleToggle = async () => {
    try {
      setIsLiking(true);
      const newState = !hasLiked;

      // Optimistic update to Zustand store
      updatePrompt(prompt.id, {
        favorites: newState
          ? [...promptData.favorites, { userId: dbUserId, promptId: prompt.id }]
          : promptData.favorites.filter((fav) => fav.userId !== dbUserId),
        _count: {
          ...promptData._count,
          favorites: newState ? likeCount + 1 : likeCount - 1,
        },
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorite`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId: prompt.id }),
        }
      );

      if (!res.ok) throw new Error("Failed to toggle favorite");
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle");

      // Revert optimistic update if failed
      updatePrompt(prompt.id, {
        favorites: hasLiked
          ? [...promptData.favorites, { userId: dbUserId, promptId: prompt.id }]
          : promptData.favorites.filter((fav) => fav.userId !== dbUserId),
        _count: {
          ...promptData._count,
          favorites: hasLiked ? likeCount + 1 : likeCount - 1,
        },
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      key={prompt.id}
      className="mb-3 break-inside-avoid  overflow-hidden relative group cursor-pointer w-full"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/prompt/${prompt.id}`);
        }}
      >
        <div className="relative w-full overflow-hidden rounded-2xl group">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover  transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className=" flex items-center justify-between w-full">
              <button
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white cursor-pointer hover:bg-white/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
                disabled={isLiking}
              >
                <Heart
                  size={20}
                  className={`${
                    hasLiked ? "fill-red-500" : "fill-transparent"
                  } stroke-white stroke-[1.5]`}
                />
                <span className="font-medium">{likeCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center py-1">
        <h3 className="text-[12px] break-words line-clamp-1 flex-1/2">
          {prompt.content}
        </h3>

        <div className="w-[30px]">
          <PopOver prompt={prompt} userId={dbUserId} size={12} />
        </div>
      </div>
      {/* <div className="flex  items-center w-max">
        
      </div> */}
    </div>
  );
}
