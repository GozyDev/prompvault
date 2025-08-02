import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { Profile } from "@/lib/type";

const ProfileImageUpload = ({ profile }: { profile: Profile }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
 

    // Upload to backend
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      // Update parent state with new URL
    } catch (error) {
      console.error("Upload error:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative mb-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile image */}
      {previewUrl || profile.imageUrl ? (
        <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4  border-purple-300  shadow-lg overflow-hidden">
          <Image
            src={previewUrl || profile.imageUrl}
            alt={profile.name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-full w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
          <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
        </div>
      )}

      {/* Change button */}
      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-purple-600 px-3 py-1 rounded-full text-xs font-medium shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Change"}
      </button>
    </div>
  );
};

export default ProfileImageUpload;
