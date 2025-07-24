"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Globe, Info, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import useProfileStore from "@/stores/useProfileStore";

// Define user profile type

type ProfileData = {
  name: string;
  bio: string;
  pronouns: string;
};
export default function ProfileEdit({
  id,
  profileData,
}: {
  id: string;
  profileData: ProfileData;
}) {
  // Initial profile data (would typically come from props or context)
  const setProfileStore = useProfileStore((state) => state.setProfileStore);
  console.log(id, "from profileedit");
  const [profile, setProfile] = useState<ProfileData>({
    name: profileData.name || "",
    bio: profileData.bio || "",
    pronouns: profileData.pronouns || "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Profile update failed");
        return;
      }

      const updatedProfile = await response.json();
      toast.success("Profile updated successfully!");
      setProfileStore(updatedProfile);
      // Optionally update state with new profile data
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  const pronounOptions = [
    "he/him",
    "she/her",
    "they/them",
    "ze/zir",
    "other",
    "prefer not to say",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-max mx-auto px-6 py-3 rounded-full cursor-pointer hover:shadow-lg transition-all flex items-center gap-2 font-medium mt-4 ">
          <Sparkles className="w-4 h-4" />
          Edit Profile
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className=" text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Your Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <User className="w-5 h-5 text-purple-600" />
              Full Name
            </label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Your name"
            />
          </div>

          {/* About Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <Info className="w-5 h-5 text-purple-600" />
              About You
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition min-h-[100px]"
              placeholder="Tell us about yourself"
            />
          </div>

          {/* Pronoun Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <span className="text-purple-600 font-bold">@</span>
              Pronouns
            </label>
            <select
              name="pronoun"
              value={profile.pronouns}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition appearance-none bg-white"
            >
              {pronounOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              {!loading ? "Save Changes" : "Updating profile .... "}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
