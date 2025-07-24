import { Bookmark, Heart, LoaderCircle, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usePromptStore } from "@/stores/usePromptStore";
import { Prompt } from "@/lib/type";
export default function Stats({
  prompt,
  dbUserId,
}: {
  prompt: Prompt;
  dbUserId: string;
}) {
  const [hasLiked, setHasLiked] = useState(false);
  const [isliking, setIsliking] = useState(false);
  const [optimisticlike, setOptimisticLike] = useState(prompt._count.favorites);
  const [hasBookedMark, setHasBookedMark] = useState(false);
  const [isBookmarking, setIsBookmarkinging] = useState(false);
  const [optimisticBookedMark, setOptimisticBookedMark] = useState(
    prompt._count.bookmarks
  );
  const likeCount = prompt._count.favorites;
  const BookCount = prompt._count.bookmarks;
  const { updatePrompt } = usePromptStore();

  useEffect(() => {
    if (prompt && dbUserId) {
      const bookmarked = prompt.bookmarks.some((bm) => bm.userId === dbUserId);
      setHasBookedMark(bookmarked);
    }
  }, [prompt, dbUserId]);

  useEffect(() => {
    if (prompt && dbUserId) {
      const liked = prompt.favorites.some((fav) => fav.userId === dbUserId);
      setHasLiked(liked);
    }
  }, [prompt, dbUserId]);

  const handleBookmarkToggle = async (promptId: string) => {
    try {
      console.log("Toggling bookmark for:", promptId);
      setIsBookmarkinging(true);

      const newState = !hasBookedMark;
      setHasBookedMark(newState);
      setOptimisticBookedMark((prev) => prev + (newState ? 1 : -1));

      // ✅ Fix: BookCount → prompt._count.bookmarks
      const bookCount = prompt._count.bookmarks;

      // ✅ Fix: updatePrompt was modifying "favorites", not "bookmarks"
      updatePrompt(prompt.id, {
        bookmarks: newState
          ? [...prompt.bookmarks, { userId: dbUserId, promptId: prompt.id }]
          : prompt.bookmarks.filter((bm) => bm.userId !== dbUserId),
        _count: {
          ...prompt._count,
          bookmarks: newState ? bookCount + 1 : bookCount - 1,
        },
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookmark`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId }),
        }
      );

      if (!res.ok) {
        const errorBody = await res.json();
        toast.error(errorBody.error || "Failed to update bookmark");
      } else {
        toast.success("Bookmark updated");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Error updating bookmark");

      // Revert local state
      setOptimisticBookedMark(prompt._count.bookmarks);
      setHasBookedMark(prompt.bookmarks.some((bm) => bm.userId === dbUserId));
    } finally {
      setIsBookmarkinging(false);
    }
  };

  const handleFavoriteToggle = async (promptId: string) => {
    try {
      setIsliking(true);
      const newState = !hasLiked;

      // ✅ Update local state immediately
      setHasLiked(newState);
      setOptimisticLike((prev) => prev + (newState ? 1 : -1));

      // ✅ Update global store
      updatePrompt(prompt.id, {
        favorites: newState
          ? [...prompt.favorites, { userId: dbUserId, promptId: prompt.id }]
          : prompt.favorites.filter((fav) => fav.userId !== dbUserId),
        _count: {
          ...prompt._count,
          favorites: newState ? likeCount + 1 : likeCount - 1,
        },
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/favorite`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId }),
        }
      );

      if (!res.ok) throw new Error("Failed to toggle favorite");

      toast.success("Success");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error");

      // Revert changes on failure
      setHasLiked(prompt.favorites.some((fav) => fav.userId === dbUserId));
      setOptimisticLike(prompt._count.favorites);
    } finally {
      setIsliking(false);
    }
  };

  return (
    <div className="flex gap-5">
      {/* Favorite */}
      <button
        className="flex items-center gap-1.5 group cursor-pointer"
        onClick={() => handleFavoriteToggle(prompt.id)}
        disabled={isliking}
      >
        <div
          className={`${
            hasLiked ? "text-red-500" : "text-gray-500"
          } flex items-center gap-2`}
        >
          <Heart
            fill={hasLiked ? "red" : "none"}
            className={`w-7 h-7 group-hover:text-rose-500 transition-colors`}
          />
          <span
            className={`font-medium group-hover:text-rose-600 transition-colors text-lg`}
          >
            {optimisticlike}
          </span>
        </div>
      </button>

      {/* Bookmark placeholder */}
      <button
        className=" group cursor-pointer"
        onClick={() => handleBookmarkToggle(prompt.id)}
        disabled={isBookmarking}
      >
        <div
          className={`${
            hasBookedMark ? "text-yellow-600" : "text-gray-500"
          } flex items-center gap-2`}
        >
          <Bookmark
            className={`${
              hasBookedMark ? "fill-yellow-600" : "fill-transparent"
            } w-7 h-7  group-hover:text-yellow-600 transition-color`}
          />
          <span className="font-medium group-hover:text-yellow-600 transition-colors text-lg">
            {optimisticBookedMark}
          </span>
        </div>
      </button>
    </div>
  );
}
