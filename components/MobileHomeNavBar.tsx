"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { LogIn, Menu, Rocket } from "lucide-react";

import { useRouter } from "next/navigation";
import { PayLoad } from "@/lib/type";
import Image from "next/image";
import { gravitas } from "@/lib/font";
export default function MobileHomeNavbar({ user }: { user: PayLoad }) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
  ];

  return (
    <div className="block md:hidden ">
      <nav className="flex justify-between items-center gap-14  w-full  mx-auto p-3 rounded-2xl bg-white/30 backdrop-blur-2xl fixed  z-[999] left-1/2 -translate-x-1/2">
        <div className="flex items-center gap">
          <Image src="/favicon.ico" alt="Logo" width={50} height={50}></Image>

          <div className={`text-md uppercase text-gray-700 font-bold ${gravitas.className}`}>
            Prompt Vault
          </div>
        </div>

        <Sheet>
          <SheetTrigger>
            {" "}
            <div className="cursor-pointer">
              <Menu  strokeWidth={3} size={30} />
            </div>
          </SheetTrigger>
          <SheetContent className="z-[999] bg-white border-none">
            <SheetTitle></SheetTitle>
            <div className="space-y-3 p-4">
              <div className="flex flex-col gap-2 uppercase ">
                {navItems.map((nav) => (
                  <a
                    href={nav.href}
                    key={nav.href}
                    className="px-2 text-md cursor font-medium text-gray-700 hover:text-purple-600"
                  >
                    {nav.name}
                  </a>
                ))}
              </div>

              <div className="relative inline-flex flex-col group gap-3">
                {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-lg opacity-100 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div> */}
                <button
                  onClick={() =>
                    router.push(`${user ? "/explore" : "/signIn"}`)
                  }
                  className="relative px-5 py-3  text-xl  rounded-full   text-white  font-bold bg-gradient-to-r from-purple-700 to-blue-800 cursor-pointer hover:scale-[1.02] group  flex items-center gap-3"
                >
                  Launch App{" "}
                  <span className="group-hover:-translate-y-1 transition-transform ">
                    <Rocket />
                  </span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
