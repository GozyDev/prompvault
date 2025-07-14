"use client";

import { Plane, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

const CreatePrompt = () => {
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const categoryOptions = [
    { value: "photography", label: "Photography" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "horror", label: "Horror" },
    { value: "realistic", label: "Realistic" },
    { value: "anime", label: "Anime" },
    { value: "animal", label: "Animals" },
    { value: "architecture", label: "Architecture" },
    { value: "character", label: "Character" },
    { value: "Food", label: "Food" },
  ];

  const handleChange = (selectedOptions: any) => {
    setSelectedCategories(selectedOptions.map((opt: any) => opt.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
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

      if (!imageFile) {
        toast.error("Please upload an image.");
        setLoading(false);
        return;
      }
      formData.append("image", imageFile);

      const res = await fetch("http://localhost:5000/api/prompt/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const errordate = await res.json();
        toast.error(errordate.error || "Unknown error");
      } else {
        setSuccess(true);
        setTitle("");
        setContent("");
        setImageUrl("");
        setSelectedCategories([]);
        setMetaData("");
        setTags("");
        setImageFile(null);
        toast.success("Prompt created successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Cast a Prompt
        </h2>
        <button
          type="submit"
          className="bg-white text-blue-600 text-md uppercase font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
          disabled={loading}
          onClick={handleSubmit}
        >
          <span>{loading ? "Creating..." : "Vault Prompt"}</span>
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto mt-8 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Image Upload Section */}
          <div className="md:w-2/5 w-full">
            <label
              className={`flex flex-col items-center justify-center w-full min-h-[400px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white overflow-hidden shadow-sm transition-all hover:border-purple-500 hover:shadow-md group relative ${
                imageUrl ? "h-auto" : ""
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImageUrl(URL.createObjectURL(file));
                  }
                }}
              />
              {!imageUrl ? (
                <div className="flex flex-col items-center p-8 text-center">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-5 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-blue-500"
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
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/80 text-gray-800 px-4 py-2 rounded-full">
                      Change Image
                    </span>
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Form Inputs Section */}
          <div className="md:w-3/5 w-full flex flex-col gap-6">
            {/* Floating Label Inputs */}
            {[
              {
                label: "Title",
                value: title,
                setter: setTitle,
                type: "text",
                placeholder: "Tell us more about your prompt",
              },
              {
                label: "Content",
                value: content,
                setter: setContent,
                type: "textarea",
                placeholder: "Write down the prompt",
              },
              {
                label: "Metadata",
                value: metaData,
                setter: setMetaData,
                type: "text",
                placeholder: "Midjourney v5, Vaporwave, High Quality, 512x512",
              },
              {
                label: "Tags",
                value: tags,
                setter: setTags,
                type: "text",
                placeholder: "Tags (comma separated)",
              },
            ].map((field) => (
              <div key={field.label} className="relative z-0">
                {field.type === "textarea" ? (
                  <textarea
                    className="block py-3 px-4 w-full text-gray-900 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer shadow-sm min-h-[150px]"
                    placeholder=" "
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required
                  />
                ) : (
                  <input
                    type={field.type}
                    className="block py-3 px-4 w-full text-gray-900 bg-white rounded-xl border border-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer shadow-sm"
                    placeholder=" "
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required={
                      field.label !== "Metadata" && field.label !== "Tags"
                    }
                  />
                )}
                <label className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 left-4 z-10 origin-[0] peer-focus:left-4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 bg-white px-2 rounded">
                  {field.label}
                </label>
              </div>
            ))}

            {/* Categories Select */}
            <div className="relative z-0">
              <label className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 left-4 z-10 origin-[0] bg-white px-2 rounded">
                Categories
              </label>
              {isClient && (
                <div className="mt-2">
                  <Select
                    className="basic-multi-select rounded-xl border border-gray-200 shadow-sm"
                    classNamePrefix="select"
                    isMulti
                    options={categoryOptions}
                    onChange={handleChange}
                    value={categoryOptions.filter((opt) =>
                      selectedCategories.includes(opt.value)
                    )}
                    placeholder="Select or type categories..."
                  />
                </div>
              )}
            </div>

            {/* Status Messages */}
            <div className="mt-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Prompt created successfully!
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrompt;
