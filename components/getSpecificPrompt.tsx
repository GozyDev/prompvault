"use client";
import { Copy, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserPCard from "./userButton";
import OpenDialog from "./OpenDialog";
import getUser from "./me";
import Stats from "./action";
import EditDialog from "./editDialog";
import { usePromptStore } from "@/stores/usePromptStore";
type PromptPreview = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  categories: string[]; // stored as stringified array
  tags: string[];
  metadata: string[];
  favorites: { userId: string }[];
  bookmarks: { userId: string }[];
  user: {
    email: string;
    name: string;
    imageUrl: string;
  };
  remixes: any[];
  _count: {
    favorites: number;
    bookmarks: number;
    remixes: number;
  };
};

export default function Specific({ id }: { id: string }) {
  const [userId, setUserId] = useState<string>("");
  const [prompt, setProp] = useState<PromptPreview>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const { prompts } = usePromptStore();
  console.log(userId , 'specific  ')
  const EditDetil = {
    title: prompt?.title,
    content: prompt?.content,
    imageUrl: prompt?.imageUrl,
    categories: prompt?.categories,
    tags: prompt?.tags,
    metadata: prompt?.metadata,
  };

  // Check if the current user has liked the post
  useEffect(() => {
    async function checkLikeStatus() {
      const user = await getUser();
      if (user) {
        setUserId(user.id);
      }
    }

    checkLikeStatus();
  }, [prompt]);

  // Fetch prompt data by ID
  useEffect(() => {
    const found = prompts.find((p) => p.id === id);
    if (found) {
      setProp(found);
      setLoading(false);
      console.log(found, "From store not Db");
    } else {
      async function getPromptById() {
        try {
          const res = await fetch(`http://localhost:5000/api/prompt/${id}`, {
            credentials: "include",
          });
          if (!res.ok) {
            const errorBody = await res.json();
            toast.error(errorBody.error);
          } else {
            const dataBody = await res.json();
            setProp(dataBody);
            console.log(found, "From db not store");
          }
        } catch (error) {
          toast.error("Internal server error");
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      getPromptById();
    }
  }, [id]);

  // Toggle favorite

  function toggleShow() {
    setShow(!show);
  }

  if (!prompt || loading) return <h1>Loading...</h1>;

  return (
    <section className="flex gap-4">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Image Section */}
        <div className="lg:col-span-7 w-full h-[630px] rounded-2xl relative bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          {/* Header with stats */}
          <div className="p-4 sticky top-[70px] bg-white border-b border border-gray-100 z-10 backdrop-blur-sm bg-opacity-90">
            <div className="flex justify-between items-center">
              <Stats prompt={prompt} dbUserId={userId}></Stats>

              <div className="flex items-center gap-3 ">
                <EditDialog editDetail={EditDetil} id={prompt.id} />
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[.98] cursor-pointer  ">
                  <span className="font-medium">Remix</span>
                  <WandSparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Image container */}
          <div className="h-full w-full p-7">
            <div className="h-[500px] w-full relative overflow-hidden flex">
              <div className="mx-auto min-w-[100px] relative">
                <img
                  src={prompt.imageUrl}
                  alt="Prompt Visualization"
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
            <div className="pb-4 border-b border-gray-100">
              <UserPCard
                user={prompt.user}
                color="bg-gradient-to-r from-purple-600 to-indigo-600"
                textColor="text-black"
              />
            </div>

            {/* Title */}
            <h1 className="font-medium pb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              <span className="text-3xl tracking-tight uppercase">
                {prompt.title.slice(0, 1).toUpperCase()}
                {prompt.title.slice(1, 25)}...
              </span>
            </h1>

            {/* Prompt Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Prompt Details
                </h3>
                <button
                  className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors group"
                  onClick={() => navigator.clipboard.writeText(prompt.content)}
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
                      ? `${prompt.content.slice(0)}`
                      : `${prompt.content.slice(0, 200)}....`}
                    {show ? (
                      <span
                        onClick={toggleShow}
                        className="text-sm py-1 px-2 bg-gray-500 text-white rounded-2xl cursor-pointer ml-4"
                      >
                        show less
                      </span>
                    ) : (
                      <span
                        onClick={toggleShow}
                        className="text-sm py-1 px-2 bg-gray-500 text-white rounded-2xl cursor-pointer ml-4"
                      >
                        show more
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-2 mt-4">
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

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mt-2">
                {prompt.categories.map((cat: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
