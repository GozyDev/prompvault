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
import { Check, Download, Ellipsis, Send, WandSparkles } from "lucide-react";
import { Prompt } from "@/lib/type";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

const PopOver = ({
  prompt,
  userId,
  size,
}: {
  prompt: Prompt;
  userId: string;
  size: number;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copy, setCopy] = useState(false);

  // Create clean share URL
  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/prompt/${prompt.id}`
    : "";

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
      const cleanFileName =
        prompt.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_")
          .slice(0, 50) + ".jpg";

      const response = await fetch(prompt.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded: ${cleanFileName}`);
    } catch (error) {
      console.error("Download failed:", error);
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
        <span className="">
          <Ellipsis size={size} />
        </span>
      </PopoverTrigger>
      <PopoverContent className="bg-white border-none rounded-2xl">
        <div className="flex flex-col gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex gap-5 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span className="font-light">Download image</span>
              </>
            )}
          </button>

          <Drawer>
            <DrawerTrigger asChild>
              <button className="flex gap-5 cursor-pointer">
                <Send size={20} /> Share
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-white rounded-t-2xl ">
              <div className="w-full max-w-5xl mx-auto">
                <DrawerHeader className="text-center hidden">
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
                        `Check out this prompt: ${prompt.title} - ${shareUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-full bg-green-50 hover:bg-green-100 transition-colors"
                    >
                      <Image
                        src="/Drawer/whatsapp-icon-logo-svgrepo-com.svg"
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Image
                        src="/Drawer/facebook-network-communication-internet-interaction-svgrepo-com.svg"
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    </a>

                    {/* Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out: ${prompt.title}`
                      )}&url=${encodeURIComponent(
                        shareUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Image
                        src="/Drawer/twitter-svgrepo-com.svg"
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    </a>

                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(
                        shareUrl
                      )}&text=${encodeURIComponent(
                        `Check out this prompt: ${prompt.title}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <Image
                        src="/Drawer/telegram-svgrepo-com.svg"
                        alt="logo"
                        width={50}
                        height={50}
                      />
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
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          setCopy(true);
                          setTimeout(() => {
                            setCopy(false);
                          }, 1500);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                      >
                        {!copy ? "Copy" : <Check />}
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