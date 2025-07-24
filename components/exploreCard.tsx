import { Heart, Link, WandSparkles } from "lucide-react";
import UserPCard from "./userButton";
import { Prompt } from "@/lib/type";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { usePromptStore } from "@/stores/usePromptStore";
import { useState } from "react";

export function ExploreCard({
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
  console.log(promptData, "1");
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

      const res = await fetch(`http://localhost:5000/api/favorite`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId: prompt.id }),
      });

      if (!res.ok) throw new Error("Failed to toggle favorite");

      toast.success("Success");
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
      className="mb-3 break-inside-avoid rounded-2xl shadow-lg  overflow-hidden relative group cursor-pointer"
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
            <div onClick={(e)=>{e.stopPropagation() ;router.push(`/profile/${prompt.user.id}`)}} className="hidden md:block">
              <UserPCard
                user={prompt.user}
                color="bg-purple-500"
                textColor="text-white"
              />
            </div>

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

          <div className="flex flex-col items-center w-full gap-4">
            <h3 className="text-white text-md font-medium text-left w-full max-w-[90%] truncate">
              {prompt.content.slice(0, 55)}...
            </h3>

            <button
              className="hidden  w-full max-w-[90%] py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all md:flex items-center justify-center gap-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/create?remix=${prompt.id}`);
              }}
            >
              <span>Remix</span>
              <WandSparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
