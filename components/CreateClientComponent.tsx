"use client";

import {
  Send,
  Link as LinkIcon,
  Wand2,
  Image as ImageIcon,
  X,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
  ),
});

// Loading component for Suspense fallback
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="relative flex justify-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
        <Wand2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="mt-4 text-gray-600">Loading prompt editor...</p>
    </div>
  </div>
);
const CreatePromptContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const remixId = searchParams.get("remix");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [metaData, setMetaData] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [originalPromptTitle, setOriginalPromptTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const fetchRemixPrompt = async () => {
      if (!remixId) {
        resetForm();
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/prompt/${remixId}`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error("Failed to fetch remix prompt");

        const data = await res.json();
        setTitle(data.title || "");
        setContent(data.content || "");
        setImageUrl(data.imageUrl || "");
        setMetaData((data.metadata || []).join(", "));
        setTags((data.tags || []).join(", "));
        setSelectedCategories(data.categories || []);
        setOriginalPromptTitle(data.title);
      } catch (error) {
        toast.error("Failed to fetch remix prompt.");
      } finally {
        setLoading(false);
      }
    };

    fetchRemixPrompt();
  }, [remixId]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setMetaData("");
    setTags("");
    setSelectedCategories([]);
    setOriginalPromptTitle("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const categoryOptions = [
    { value: "photography", label: "Photography" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "horror", label: "Horror" },
    { value: "realistic", label: "Realistic" },
    { value: "anime", label: "Anime" },
    { value: "animal", label: "Animals" },
    { value: "architecture", label: "Architecture" },
    { value: "character", label: "Character" },
    { value: "food", label: "Food" },
  ];

  const handleCategoryChange = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions.map((opt: any) => opt.value));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setTimeout(() => {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setIsUploadingImage(false);
    }, 800);
  };

  const removeImage = () => {
    setImageUrl("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!title || !content || selectedCategories.length === 0) {
        toast.error("Please fill all required fields");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("categories", JSON.stringify(selectedCategories));
      formData.append(
        "tags",
        JSON.stringify(
          tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        )
      );
      formData.append(
        "metadata",
        JSON.stringify(
          metaData
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean)
        )
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (remixId) {
        formData.append("remixedFromId", remixId);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/prompt/`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create prompt");
      }

      // Show success and redirect
      setSuccess(true);
      toast.success("Prompt created successfully!");
      setTimeout(() => router.push("/explore"), 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "Failed to create prompt");
    } finally {
      setLoading(false);
    }
  };

  if (loading && remixId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center ">
        <div className="text-center">
          <div className="relative flex justify-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin"></div>
            <Wand2 className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600">Loading remix data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Wand2 className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {originalPromptTitle ? "Remix Prompt" : "Create New Prompt"}
              </h1>
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-white text-blue-600 text-sm font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span>Publish Prompt</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {originalPromptTitle && (
            <div className="mt-4 flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm max-w-max">
              <LinkIcon className="w-4 h-4 text-white" />
              <span className="text-white font-medium">Remixing:</span>
              <Link
                href={`/prompt/${remixId}`}
                className="text-white underline hover:text-blue-200 transition-colors truncate max-w-[200px]"
                title={originalPromptTitle}
              >
                {originalPromptTitle}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Image Upload */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                Prompt Image
              </h2>

              <div
                className={`border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 group transition-all ${
                  imageUrl
                    ? "border-gray-300"
                    : "border-gray-300 hover:border-purple-500"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />

                {!imageUrl ? (
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-4"></div>
                        <span className="text-gray-600">
                          Uploading image...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-4 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-600 font-medium">
                          Drag & drop or click to upload
                        </span>
                        <span className="text-gray-400 text-sm mt-2">
                          PNG, JPG, GIF up to 10MB
                        </span>
                        {remixId && (
                          <p className="mt-3 text-sm text-purple-600 font-medium">
                            Original image will be used if not provided
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-[400px] object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 hover:bg-white transition-colors shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Categories
                </h2>
                <Select
                  className="basic-multi-select rounded-lg border border-gray-200 shadow-sm"
                  classNamePrefix="select"
                  isMulti
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  value={categoryOptions.filter((opt) =>
                    selectedCategories.includes(opt.value)
                  )}
                  placeholder="Select categories..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Select at least one category to help others find your prompt
                </p>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Prompt Details
                </h2>

                <div className="space-y-5">
                  {[
                    {
                      label: "Title",
                      value: title,
                      setter: setTitle,
                      type: "text",
                      placeholder: "Describe your prompt",
                      required: true,
                      icon: <span className="text-xl">📝</span>,
                    },
                    {
                      label: "Prompt Content",
                      value: content,
                      setter: setContent,
                      type: "textarea",
                      placeholder: "Enter your prompt details...",
                      required: true,
                      icon: <span className="text-xl">✨</span>,
                    },
                    {
                      label: "Metadata",
                      value: metaData,
                      setter: setMetaData,
                      type: "text",
                      placeholder: "Midjourney v5, Vaporwave, High Quality",
                      required: false,
                      icon: <span className="text-xl">🔧</span>,
                    },
                    {
                      label: "Tags",
                      value: tags,
                      setter: setTags,
                      type: "text",
                      placeholder: "ai, art, digital",
                      required: false,
                      icon: <span className="text-xl">🏷️</span>,
                    },
                  ].map((field) => (
                    <div key={field.label} className="relative">
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        {field.icon}
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          required={field.required}
                          rows={5}
                        />
                      ) : (
                        <input
                          type={field.type}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Messages */}
              <div className="pt-4">
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <X className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Error creating prompt</h3>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Success!</h3>
                      <p className="text-sm">
                        Prompt created successfully. Redirecting to explore
                        page...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspiration Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Prompt Creation Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Be Specific</h3>
              <p className="text-gray-600 text-sm">
                Include details like art style, composition, and mood to get
                better results.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Use Keywords</h3>
              <p className="text-gray-600 text-sm">
                Include relevant keywords in your metadata to help others
                discover your prompt.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Add Tags</h3>
              <p className="text-gray-600 text-sm">
                Tag your prompt with relevant topics to increase its visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CreateCLientComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <CreatePromptContent />
    </Suspense>
  );
}
