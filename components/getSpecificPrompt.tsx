"use client";
import { Copy, WandSparkles, Link as LinkIcon, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserPCard from "./userButton";
import OpenDialog from "./OpenDialog";
import getUser from "./me";
import Stats from "./action";
import EditDialog from "./editDialog";
import { usePromptStore } from "@/stores/usePromptStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Specific({ id }: { id: string }) {
  const prompt = usePromptStore((state) =>
    state.prompts.find((p) => p.id === id)
  );

  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true); // Start with loading true
  const [show, setShow] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<Prompt | null>(null);

  const router = useRouter();
  // Get edit details if prompt exists
  const editDetail = prompt
    ? {
        title: prompt.title,
        content: prompt.content,
        imageUrl: prompt.imageUrl,
        categories: prompt.categories,
        tags: prompt.tags,
        metadata: prompt.metadata,
      }
    : null;

  useEffect(() => {
    async function fetchPrompt() {
      try {
        // Check if prompt exists in store
        const exists = usePromptStore
          .getState()
          .prompts.find((p) => p.id === id);

        if (!exists) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/prompt/${id}`,
            {
              credentials: "include",
            }
          );

          if (!res.ok) {
            const errorBody = await res.json();
            toast.error(errorBody.error);
            return;
          }

          const data = await res.json();
          usePromptStore
            .getState()
            .setPrompts([...usePromptStore.getState().prompts, data]);

          // Fetch original prompt if this is a remix
          if (data.remixedFromId) {
            fetchOriginalPrompt(data.remixedFromId);
          }
        } else if (exists.remixedFromId) {
          // Fetch original if not already in store
          fetchOriginalPrompt(exists.remixedFromId);
        }
      } catch (error) {
        toast.error("Failed to load prompt");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchOriginalPrompt(originalId: string) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/prompt/${originalId}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setOriginalPrompt(data);
        }
      } catch (error) {
        console.error("Failed to fetch original prompt", error);
      }
    }

    fetchPrompt();
  }, [id]);

  useEffect(() => {
    async function checkUser() {
      const user = await getUser();
      if (user) setUserId(user.id);
    }
    checkUser();
  }, []);

  const toggleShow = () => setShow(!show);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ">
        <div className="text-center">
          <div className="relative flex justify-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
            <Wand2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600">Loading prompt data ...</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Prompt not found</h1>
          <p className="mt-2 text-gray-600">
            The requested prompt could not be loaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex gap-4">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Image Section */}
        <div className="lg:col-span-7 w-full h-[630px]  relative bg-white border border-gray-200">
          <div className="p-4 sticky top-[0px] md:top-[0px] bg-white border-b border border-gray-200 z-10 backdrop-blur-sm bg-opacity-90">
            <div className="flex justify-between items-center">
              <Stats prompt={prompt} dbUserId={userId} />
              <div className="flex items-center gap-3">
                {editDetail && prompt.user.id === userId && (
                  <EditDialog editDetail={editDetail} id={prompt.id} />
                )}
                <Link
                  href={`/create?remix=${prompt.id}`}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[.98] cursor-pointer"
                >
                  <span className="font-medium">Remix</span>
                  <WandSparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="h-full w-full p-7 ">
            <div className="h-[500px] w-full relative overflow-hidden flex">
              <div className="mx-auto min-w-[100px] relative">
                <img
                  src={prompt.imageUrl}
                  alt={prompt.title}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <OpenDialog imageUrl={prompt.imageUrl} />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-5 w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Remix Indicator */}
            {originalPrompt && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-start">
                <LinkIcon className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0 "  />
                <div>
                  <p className="text-sm font-medium text-purple-800 relative">
                    Remixed from:{" "}
                    <Link
                      href={`/prompt/${originalPrompt.id}`}
                      className="underline hover:text-purple-600"
                    >
                      {originalPrompt.title}
                    </Link>
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    by {originalPrompt.user.name}
                  </p>
                </div>
              </div>
            )}

            <div className="pb-4 border-b border-gray-200">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${prompt.user.id}`);
                }}
                className="z-10 cursor-pointer relative"
              >
                <UserPCard
                  user={prompt.user}
                  color="bg-purple-500"
                  textColor="text-black"
                />
              </div>
            </div>

            <h1 className="font-medium pb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent ">
              <span className="text-3xl tracking-tight">{prompt.title}</span>
            </h1>

            <div className="space-y-4">
              <div className="flex items-center justify-between ">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Prompt Details
                </h3>
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors group"
                  onClick={() => {
                    navigator.clipboard.writeText(prompt.content);
                    toast.info("Prompt copied to clipboard!");
                  }}
                >
                  <Copy
                    size={18}
                    className="text-gray-500 group-hover:text-purple-600 transition-colors"
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="p-4 bg-white rounded-lg shadow-inner border border-gray-100">
                  <p className="text-gray-700 font-light leading-relaxed">
                    {show
                      ? prompt.content
                      : `${prompt.content.slice(0, 200)}...`}
                    <button
                      onClick={toggleShow}
                      className="py-1 px-2 font-bold text-purple-900 rounded-full cursor-pointer ml-2 hover:text-purple-700 transition-colors"
                    >
                      {show ? "Show less" : "Show more"}
                    </button>
                  </p>
                </div>
              </div>

              {/* Metadata */}
              {prompt.metadata.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Metadata
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {prompt.metadata.map((meta, i) => {
                      const colors = [
                        "bg-red-100 text-red-800 border-red-200",
                        "bg-blue-100 text-blue-800 border-blue-200",
                        "bg-green-100 text-green-800 border-green-200",
                        "bg-yellow-100 text-yellow-800 border-yellow-200",
                        "bg-purple-100 text-purple-800 border-purple-200",
                        "bg-pink-100 text-pink-800 border-pink-200",
                      ];
                      const colorClass = colors[i % colors.length];

                      return (
                        <span
                          key={i}
                          className={`px-3 py-2 rounded-xl text-sm font-medium border ${colorClass} hover:shadow-md transition-shadow`}
                        >
                          {meta}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories */}
              {prompt.categories.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {prompt.categories.map((cat, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-300"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type Prompt = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  metadata: string[];
  categories: string[];
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl: string;
  };
  remixedFromId: string | null;
  favorites: any[];
  bookmarks: any[];
  _count: {
    favorites: number;
    bookmarks: number;
  };
};
