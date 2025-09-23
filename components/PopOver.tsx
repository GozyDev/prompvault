import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 rounded-2xl border border-purple-200 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
            <Share /> Share
          </button>
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
