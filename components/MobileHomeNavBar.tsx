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
import { LogIn, Menu } from "lucide-react";

import { useRouter } from "next/navigation";
import { PayLoad } from "@/lib/type";

export default function MobileHomeNavbar({ user }: { user: PayLoad }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  //   console.log(user);

  //   // Handle scroll effect for navbar
  //   useEffect(() => {
  //     const handleScroll = () => {
  //       setScrolled(window.scrollY > 20);
  //     };

  //     window.addEventListener("scroll", handleScroll);
  //     return () => window.removeEventListener("scroll", handleScroll);
  //   }, []);
  //   useEffect(() => {
  //     async function getUserData() {
  //       const user = await getUser();
  //       setUSer(user);
  //     }
  //     getUserData();
  //   }, []);

  // Close mobile menu when clicking links
  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
  ];

  return (
    <div className="block md:hidden ">
      <nav className="flex justify-between items-center gap-14  w-full  mx-auto p-3 rounded-2xl bg-white/30 backdrop-blur-2xl fixed  z-[999] left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center bg-black rounded">
            {/* Diagonal background bar with gradient */}
            <div className="absolute z-1  inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 w-[150%] h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
            </div>
            {/* Gradient text with modern styling */}
            <span className="relative z-10 text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tighter">
              PV
            </span>
          </div>
          <div className="text-xl uppercase font-bold">Prompt Vault</div>
        </div>

        <Sheet>
          <SheetTrigger>
            {" "}
            <div className="cursor-pointer">
              <Menu />
            </div>
          </SheetTrigger>
          <SheetContent className="z-[999] bg-white">
            <SheetTitle></SheetTitle>
            <div className="space-y-3 p-4">
              <div className="flex flex-col gap-2">
                {navItems.map((nav) => (
                  <a
                    href={nav.href}
                    key={nav.href}
                    className="px-2 text-md cursor font-medium text-gray-800 hover:text-purple-600"
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
                  className="relative px-5 py-1  rounded  text-white bg-gray-500  font-bold cursor-pointer "
                >
                  <span className="flex items-center gap-1">
                    Login <LogIn size={20} />
                  </span>
                </button>
                {!user && (
                  <button
                    onClick={() => router.push("/signUp")}
                    className="relative px-5 py-1  rounded  text-white  font-bold bg-gradient-to-r from-purple-700 to-blue-800 cursor-pointer"
                  >
                    Create an account
                  </button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
