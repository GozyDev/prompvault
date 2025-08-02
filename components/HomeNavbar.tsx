"use client";
import { useState, useEffect } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { PayLoad } from "@/lib/type";
import Image from "next/image";

export default function HomeNavbar({ user }: { user: PayLoad }) {
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
    <div className="hidden md:block">
      <nav className=" flex justify-between items-center gap-14  w-full max-w-max  mx-auto p-9 py-0  rounded-full bg-white/30 backdrop-blur-2xl fixed top-5  z-[999] left-1/2 -translate-x-1/2">
        <div className="flex items-center">
          <Image src="/favicon.ico" alt="Logo" width={50} height={50}></Image>
          <div className="text-lg uppercase font-bold text-gray-800 ">Prompt Vault</div>
        </div>
        <div>
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

        <div className="relative inline-flex group gap-3">
          {/* <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-lg opacity-100 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div> */}
          <button
            onClick={() => router.push(`${user ? "/explore" : "/signIn"}`)}
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
      </nav>
    </div>
  );
}
