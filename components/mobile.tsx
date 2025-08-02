"use client";
import { Home, Search, SquarePlus, User, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProfileButton from "./profileButton";
import { useState } from "react";
import AlertLogOutMobile from "./AlertDialogMobile";
import Image from "next/image";

const navItems = [
  { href: "/explore", icon: Home, label: "Explore" },
  { href: "/create", icon: SquarePlus, label: "Create" },
];

export default function MobileNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [profileActive, setProfileActive] = useState(false);

  // Check if any profile-related route is active
  const isProfileActive =
    pathname.startsWith("/profile") || pathname.startsWith("/account");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg  flex justify-center gap-3 items-center  md:hidden " >
      
        <div
          className=""
          onClick={() => router.push("/")}
        >
          <Image src="/favicon.ico" alt="Logo" width={40} height={40} ></Image>
        </div>
    
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-in-out ${
              isActive ? "text-black" : "text-gray-600 hover:text-gray-800"
            }`}
            aria-label={label}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 transition-transform`} />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-black rounded-full"></span>
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                isActive ? "text-black" : "text-gray-800"
              }`}
            ></span>
          </Link>
        );
      })}

      <AlertLogOutMobile />

      {/* Profile Button */}
      <div
        className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-in-out ${
          isProfileActive || profileActive
            ? ""
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <div className="relative">
          <ProfileButton />
          {(isProfileActive || profileActive) && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2"></span>
          )}
        </div>
      </div>
    </nav>
  );
}
