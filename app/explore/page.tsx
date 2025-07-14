"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePromptStore } from "@/stores/usePromptStore";
import { ExploreM } from "@/components/explore";
import getUser from "@/components/me";

const Explore = () => {
  const [userId, setUserId] = useState<string>("");
  const { prompts, setPrompts, clearPrompts } = usePromptStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if the current user has liked the post
  useEffect(() => {
    async function checkLikeStatus() {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }
    }

    checkLikeStatus();
  }, []);

  useEffect(() => {
    const fetchPrompts = async () => {
      if (prompts.length === 0) {
        try {
          const res = await fetch("http://localhost:5000/api/prompt", {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch prompts");
          const data = await res.json();
          setPrompts(data);
        } catch (err: any) {
          setError(err.message || "Unknown error");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // skip loading if already cached
      }
    };
    fetchPrompts();
  }, [prompts, setPrompts]);

  // ...your existing JSX remains the same

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl text-gray-700 bg-white">
        Loading prompts...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 bg-white">
        {error}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <ExploreM prompts={prompts} dbUserId={userId} />
    </div>
  );
};

export default Explore;
