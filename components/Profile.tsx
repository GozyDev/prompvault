"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Calendar,
  Loader2,
  WandSparkles,
  Bookmark,
  CopyIcon,
  Copy,
  Trash,
  Wand2,
} from "lucide-react";
import { Prompt, Usertype } from "@/lib/type";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileEdit from "@/components/profileEdit";
import useProfileStore from "@/stores/useProfileStore";
import getUser from "./me";
import ProfileImageUpload from "./ImageEdit";
import Delete from "./Delete";

type ProfileData = {
  id: string;
  email: string;
  name: string;
  bio: string;
  pronouns: string;
  imageUrl: string;
  prompts: Prompt[];
  bookmarks: Prompt[];
  // Changed to array of prompts
  createdAt: string;
};

export default function ProfileD({ id }: { id: string }) {
  const profile = useProfileStore((state) => state.profile);
  const [user, setUser] = useState<Usertype>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"created" | "saved">("created");
  const setProfileStore = useProfileStore((state) => state.setProfileStore);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const exit = profile?.id === id;

        if (!exit) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch profile");
          }

          const data = await response.json();

          setProfileStore(data);
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Problem getting profile");
        toast.error(err.message || "Problem getting profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    async function user() {
      const user = await getUser();
      setUser(user);
    }
    user();
  }, []);

  // Format the creation date
  const formattedDate = profile
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Get current content to show based on active tab
  const currentContent = () => {
    if (!profile) return [];
    return activeTab === "created"
      ? profile.prompts
      : profile?.bookmarks.map((bookmark) => bookmark.prompt);
  };

  if (loading) {
   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ">
        <div className="text-center">
          <div className="relative flex justify-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
            <Wand2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-xl max-w-md">
          <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <User className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-600 mt-4">Profile Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
            <User className="text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mt-4">
            No Profile Found
          </h2>
          <p className="mt-2 text-gray-600">
            We couldn't find your profile information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className=" p-3">
          <div className="flex flex-col items-center">
            {/* Profile Image */}

            {profile.id === user?.id ? (
              <ProfileImageUpload profile={profile}></ProfileImageUpload>
            ) : (
              <div className="relative mb-3">
                {profile.imageUrl ? (
                  <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-purple-300 shadow-lg overflow-hidden">
                    <Image
                      src={profile.imageUrl}
                      alt={profile.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col justify-center text-center gap-2  w-full">
              {/* Name and Pronouns */}
              <div className="flex flex-col-reverse">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter cursive">
                  {profile.name}
                </h1>
                {profile.pronouns && (
                  <div className=" text-gray-700 text-sm font-medium text-center">
                    {profile.pronouns}
                  </div>
                )}
              </div>
              {/* Email */}
              <div className="">
                <p className="text-gray-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span
                    className="truncate max-w-[200px] md:max-w-xs"
                    title={profile.email}
                  >
                    {profile.email}
                  </span>
                </p>
              </div>
              {/* Bio */}
              {profile.bio && (
                <div className=" max-w-md mx-auto">
                  <p className="text-gray-500 bg-white/10 rounded-xl  text-base">
                    {profile.bio}
                  </p>
                </div>
              )}
              {/* Member Since */}
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                Member since {formattedDate}
              </div>
              {profile.id === user?.id && <ProfileEdit id={id} profileData={profile}></ProfileEdit>}
            </div>
          </div>
        </div>

        {/* Stats and Tabs */}
        <div className="bg-white rounded-2xl py-6 ">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-400 mb-6 px-6 py-3">
            <button
              className={`flex items-center gap-2 px-4 py-3 font-medium cursor-pointer ${
                activeTab === "created"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("created")}
            >
              <WandSparkles className="w-4 h-4" />
              Created
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-3 font-medium cursor-pointer ${
                activeTab === "saved"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-700 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
          </div>

          {/* Content Area */}
          {currentContent().length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                {activeTab === "created" ? (
                  <WandSparkles className="w-10 h-10 text-gray-400" />
                ) : (
                  <Bookmark className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No {activeTab === "created" ? "Created" : "Saved"} Prompts
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {activeTab === "created"
                  ? "You haven't created any prompts yet. Start creating to see them appear here!"
                  : "You haven't saved any prompts yet. Save your favorites to access them later."}
              </p>
              {activeTab === "created" && (
                <button
                  onClick={() => router.push("/create")}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg transition-all"
                >
                  Create Your First Prompt
                </button>
              )}
            </div>
          ) : (
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-1">
              {currentContent().map((prompt) => (
                <div
                  key={prompt.id}
                  className="mb-3 break-inside-avoid rounded-2xl shadow-md border border-gray-200 overflow-hidden relative group cursor-pointer hover:shadow-lg transition-shadow h-max"
                  onClick={() => router.push(`/prompt/${prompt.id}`)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full">
                    <Image
                      src={prompt.imageUrl}
                      alt={prompt.title}
                      width={300}
                      height={300}
                      className="w-full  transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity ">
                      <div className="flex justify-between ">
                        {prompt.userId === user?.id && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Delete id={prompt.id}></Delete>
                          </div>
                        )}

                        <button
                          className="bg-white/90 text-purple-600 p-2 rounded-full hover:bg-white transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(prompt.content);
                            toast.success("Prompt copied to clipboard!");
                          }}
                        >
                          <Copy size={20} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        <h3 className="text-white text-lg font-medium truncate">
                          {prompt.title}
                        </h3>

                        <button
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-2xl cursor-pointer     flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/create?remix=${prompt.id}`);
                          }}
                        >
                          <WandSparkles className="w-4 h-4" />
                          <span>Remix</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
