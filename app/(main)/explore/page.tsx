"use client";
import { useEffect, useState, useRef } from "react";
import { usePromptStore } from "@/stores/usePromptStore";
import { ExploreM } from "@/components/explore";
import getUser from "@/components/me";
import { toast } from "react-toastify";

import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Camera,
  Rocket,
  Ghost,
  Building,
  Tv,
  PawPrint,
  Hamburger,
  UserRound,
  Sword,
} from "lucide-react";

const Explore = () => {
  const [userId, setUserId] = useState<string>("");
  const { prompts, setPrompts, hasFetched, setHasFetched } = usePromptStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  console.log(showLeftScroll);

  // Category options with icons
  const categoryOptions = [
    { value: "all", label: "All Prompts", icon: <Globe /> },
    { value: "photography", label: "Photography", icon: <Camera /> },
    { value: "sci-fi", label: "Sci-Fi", icon: <Rocket /> },
    { value: "horror", label: "Horror", icon: <Ghost /> },
    { value: "realistic", label: "Realistic", icon: <Tv /> },
    { value: "anime", label: "Anime", icon: <Sword /> },
    { value: "animal", label: "Animals", icon: <PawPrint /> },
    { value: "architecture", label: "Architecture", icon: <Building /> },
    { value: "character", label: "Character", icon: <UserRound /> },
    { value: "food", label: "Food", icon: <Hamburger /> },
  ];

  // Filter prompts based on selected category
  const filteredPrompts =
    selectedCategory && selectedCategory !== "all"
      ? prompts.filter((prompt) => prompt.categories.includes(selectedCategory))
      : prompts;

  // Handle scroll buttons
  const scrollCategories = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // Adjust as needed
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Check scroll position to show/hide buttons
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }

    alert("working");
  };

  useEffect(() => {
    if (!hasFetched) {
      async function fetchData() {
        try {
          setLoading(true);
          const promptsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/prompt`, {
            credentials: "include",
          });

          if (!promptsRes.ok) throw new Error("Failed to fetch prompts");

          const promptsData = await promptsRes.json();
          setPrompts(promptsData);
          setHasFetched(true);
        } catch (err: any) {
          setError(err.message || "Error loading prompts");
          toast.error(err.message || "Error loading prompts");
        } finally {
          setLoading(false);
        }
      }

      fetchData();
    } else {
      setLoading(false);
    }
  }, [hasFetched]);

  useEffect(() => {
    async function getUserId() {
      try {
        const user = await getUser();
        if (user) setUserId(user.id);
      } catch (error) {
        console.error("Failed to get user ID", error);
      }
    }
    getUserId();
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Initial check
      checkScrollPosition();

      // Add scroll event listener
      container.addEventListener("scroll", checkScrollPosition);

      // Cleanup
      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 ">
        <div className=" mx-auto">
          {/* Category Skeleton */}
          <div className="w-full flex gap-2 mb-8 animate-pulse overflow-hidden ">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-gray-200" />
            ))}
          </div>

          {/* Prompts Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="bg-gray-200 aspect-square w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Couldn't Load Prompts
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:shadow-md transition-shadow"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white z ">
      {/* Category Filter */}
      <div className="fixed left-0  md:pl-[90px] top-0 z-10 bg-white p-1 pt-3 md:pt-6  w-full ">
        <div className="flex relative   w-full">
          {/* Left scroll button */}
          {showLeftScroll && (
            <button
              onClick={() => scrollCategories("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-md p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {/* Right scroll button */}
          {showRightScroll && (
            <button
              onClick={() => scrollCategories("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white rounded-full shadow-lg p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-7 h-7 text-gray-700" />
            </button>
          )}

          {/* Scrollable categories */}
          <div
            ref={scrollContainerRef}
            className="w-full flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-3 rounded-full  font-medium transition-all ${
                  selectedCategory === option.value ||
                  (!selectedCategory && option.value === "all")
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(option.value)}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto p-2 md:px-4 pt-[80px]">
        {/* Prompts Grid */}
        <ExploreM prompts={filteredPrompts} dbUserId={userId} />

        {/* Empty State */}
        {filteredPrompts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gray-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Prompts Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedCategory
                ? `No ${
                    categoryOptions.find((c) => c.value === selectedCategory)
                      ?.label
                  } prompts available.`
                : "No prompts available yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
