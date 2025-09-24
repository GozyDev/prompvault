import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Download, EllipsisVertical, Share, WandSparkles } from "lucide-react";
import { Prompt } from "@/lib/type";

import React, { useState } from "react";
import { toast } from "react-toastify";
import EditDialog from "./editDialog";
import Link from "next/link";

const PopOver = ({ prompt, userId }: { prompt: Prompt; userId: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!prompt) {
      toast.error("Prompt data is not available.");
      return;
    }
    setIsDownloading(true);

    try {
      // Create clean filename from project title
      const cleanFileName =
        prompt.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .slice(0, 50) + ".jpg";

      // Method 1: Fetch and download (most reliable)
      const response = await fetch(prompt.imageUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      console.log("Url", url);
      console.log("Res", response);
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanFileName; // This sets the filename

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded: ${cleanFileName}`);
    } catch (error) {
      console.error("Download failed:", error);

      // Fallback: Open in new tab if fetch fails
      const fallbackUrl = prompt?.imageUrl.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
      window.open(fallbackUrl, "_blank");
      toast.info("Opening image in new tab");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="shadow p-2 rounded bg-gray-50">
          <EllipsisVertical />
        </button>
      </PopoverTrigger>
      <PopoverContent className="bg-white border-none rounded-2xl">
        {" "}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-2xl border border-purple-200 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download />
                <span>Download</span>
              </>
            )}
          </button>

          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-2xl border border-purple-200 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                <Share /> Share
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-white rounded-t-2xl ">
              <div className="w-full max-w-5xl mx-auto">
                <DrawerHeader className="text-center">
                  <DrawerTitle>Share this prompt</DrawerTitle>
                  <DrawerDescription>
                    Share this amazing prompt with others
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-6 ">
                  {/* Social Share Buttons */}
                  <div className="flex flex-wrap w-full justify-center gap-4 mb-6 px-3">
                    {/* WhatsApp */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">WA</span>
                      </div>
                      <span className="text-sm font-medium">WhatsApp</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">f</span>
                      </div>
                      <span className="text-sm font-medium">Facebook</span>
                    </a>

                    {/* Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out: ${prompt.title}`
                      )}&url=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">𝕏</span>
                      </div>
                      <span className="text-sm font-medium">Twitter</span>
                    </a>

                    {/* Telegram - FIXED */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(
                        typeof window !== "undefined"
                          ? window.location.href
                          : ""
                      )}&text=${encodeURIComponent(
                        `Check out this prompt: ${prompt.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">TG</span>
                      </div>
                      <span className="text-sm font-medium">Telegram</span>
                    </a>
                  </div>
                  {/* Copy Link Section */}
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Or copy link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={
                          typeof window !== "undefined"
                            ? window.location.href
                            : ""
                        }
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            typeof window !== "undefined"
                              ? window.location.href
                              : ""
                          );
                          toast.success("Link copied to clipboard!");
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Close
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          {editDetail && prompt.user.id === userId && (
            <EditDialog editDetail={editDetail} id={prompt.id} />
          )}
          <Link
            href={`/create?remix=${prompt.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-2xl hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[.98] cursor-pointer"
          >
            <WandSparkles className="w-4 h-4" />
            <span className="font-medium">Remix</span>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PopOver;
