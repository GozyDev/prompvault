"use client";

import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger 
} from "@/components/ui/sheet";
import { FilePenLine, Pencil } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import Select from "react-select";
import { toast } from "react-toastify";

type EditDetailData = {
  title: string;
  content: string;
  imageUrl: string;
  categories: string[];
  tags: string[];
  metadata: string[];
};

type FormField = {
  label: string;
  value: string;
  setter: (value: string) => void;
  type: "text" | "textarea";
  placeholder: string;
  required?: boolean;
};

const CATEGORY_OPTIONS = [
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

export default function EditDialog({
  editDetail,
  id,
}: {
  editDetail: EditDetailData;
  id: string;
}) {
  // State management
  const [title, setTitle] = useState(editDetail.title);
  const [content, setContent] = useState(editDetail.content);
  const [metaData, setMetaData] = useState(editDetail.metadata.join(", "));
  const [tags, setTags] = useState(editDetail.tags.join(", "));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(editDetail.categories);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Refs
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
      // Cleanup async operations on unmount
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleCategoryChange = useCallback((selectedOptions: any) => {
    setSelectedCategories(selectedOptions.map((opt: any) => opt.value));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    
    // Create new AbortController for the request
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(`http://localhost:5000/api/prompt/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          categories: selectedCategories,
          tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
          metadata: metaData.split(",").map(item => item.trim()).filter(Boolean),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update failed");
      }

      toast.success("Updated successfully");
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error(error.message || "Failed to update");
      }
    } finally {
      setLoading(false);
    }
  }, [title, content, selectedCategories, tags, metaData, id]);

  const formFields: FormField[] = [
    {
      label: "Title",
      value: title,
      setter: setTitle,
      type: "text",
      placeholder: "Tell us more about your prompt",
      required: true,
    },
    {
      label: "Content",
      value: content,
      setter: setContent,
      type: "textarea",
      placeholder: "Write down the prompt",
      required: true,
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
  ];

  return (
    <Sheet>
      <SheetTrigger>
        <span className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-2xl border border-purple-200 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
          <Pencil className="w-4 h-4" />
          <span className="font-medium">Edit</span>
        </span>
      </SheetTrigger>

      <SheetContent className="bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 shadow-xl w-full max-w-[500px] p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-gray-200">
            <SheetTitle className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-full">
                <FilePenLine className="text-white w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Edit Prompt
              </span>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {formFields.map((field) => (
              <div key={field.label} className="relative z-0 group">
                {field.type === "textarea" ? (
                  <textarea
                    className="block w-full p-4 text-gray-900 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent peer shadow-sm min-h-[120px] transition-all"
                    placeholder=" "
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="block w-full p-4 text-gray-900 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent peer shadow-sm transition-all"
                    placeholder=" "
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    required={field.required}
                  />
                )}
                <label className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 left-4 z-10 origin-[0] peer-focus:left-4 peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 bg-white px-2 rounded font-medium">
                  {field.label}
                </label>
              </div>
            ))}

            <div className="relative z-0">
              <label className="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 left-4 z-10 origin-[0] bg-white px-2 rounded font-medium">
                Categories
              </label>
              {isClient && (
                <div className="mt-2">
                  <Select
                    className="react-select-container rounded-xl border border-gray-200 shadow-sm"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        padding: "12px 16px",
                        border: "none",
                        boxShadow: "none",
                        minHeight: "56px",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#7e22ce"
                          : state.isFocused
                          ? "#f3e8ff"
                          : "white",
                        color: state.isSelected ? "white" : "#4b5563",
                        padding: "12px 16px",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#f3e8ff",
                        borderRadius: "8px",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "#7e22ce",
                        fontWeight: "500",
                      }),
                    }}
                    isMulti
                    options={CATEGORY_OPTIONS}
                    onChange={handleCategoryChange}
                    value={CATEGORY_OPTIONS.filter((opt) =>
                      selectedCategories.includes(opt.value)
                    )}
                    placeholder="Select or type categories..."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all font-medium flex items-center gap-2 rounded-2xl disabled:opacity-70"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <span>Save Changes</span>
                  <FilePenLine className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}