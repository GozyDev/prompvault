import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import Image from "next/image";

export default function OpenDialog({ imageUrl }: { imageUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger className=" p-4 absolute bottom-[60px] right-6">
        <div className="  bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg flex items-center gap-2 group hover:bg-white transition-all cursor-pointer border border-gray-200">
          <p className="text-sm font-medium text-gray-700 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[100px] transition-all duration-300 whitespace-nowrap">
            View larger
          </p>
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </div>
      </DialogTrigger>
      <DialogContent className="border-none w-max shadow-none p-0">
        <DialogTitle></DialogTitle>
        <div className="">
          <Image
            src={imageUrl}
            alt="Image Preview"
            width={500}
            height={500}
            className="max-w-[350px] mx-auto rounded-2xl"
          ></Image>
        </div>
      </DialogContent>
    </Dialog>
  );
}
