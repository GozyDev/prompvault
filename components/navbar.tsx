"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, SquarePlus, User, LogOut } from "lucide-react";
import ProfileButton from "./profileButton";
import { useEffect, useState } from "react";
import AlertLogOut from "./AleartLogout";


const navItems = [
  {
    href: "/explore",
    label: "Explore",
    icon: <Home strokeWidth={2.4} />,
    activeColor: "bg-gradient-to-r from-blue-500 to-purple-600 text-black",
    inactiveColor: "text-gray-500 hover:bg-gray-200 hover:text-black",
    tooltip: "Home / Explore",
  },
  {
    href: "/create",
    label: "Create",
    icon: <SquarePlus strokeWidth={2.4} />,
    activeColor: "bg-gradient-to-r from-blue-500 to-purple-600 text-black",
    inactiveColor: "text-gray-500 hover:bg-gray-200 hover:text-black",
    tooltip: "Create Prompt",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const router = useRouter()

  // Handle profile routes separately
  useEffect(() => {
    // Set active path while handling profile routes
    if (pathname.startsWith("/profile")) {
      setActivePath("/profile");
    } else {
      setActivePath(pathname);
    }
  }, [pathname]);

  return (
    <nav className="h-full w-full flex flex-col items-center py-8 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100">
      <ul className="flex flex-col gap-5 w-full items-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-3">
          <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
            PV
          </span>
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <li
              key={item.href}
              className="w-full flex justify-center group relative "
            >
              <button
              onClick={()=> router.push(item.href) }
               
                className={`flex flex-col items-center justify-center w-14 h-14  transition-all duration-300 ease-in-out  rounded-2xl ${
                  isActive ? item.activeColor : item.inactiveColor
                } hover:shadow-lg hover:scale-105 transform`}
              >
                {/* Navigation Icon */}
                <div
                  className={
                    isActive
                      ? "text-white"
                      : "text-gray-600 group-hover:text-purple-600"
                  }
                >
                  {item.icon}
                </div>

                {/* Active indicator dot */}

                {/* Animated Tooltip */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                  {item.tooltip}
                  {isActive && " (active)"}
                  {/* Tooltip pointer */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </button>
            </li>
          );
        })}

       <AlertLogOut/>

        {/* Profile Button */}
        <li className="group relative">
          <div className="relative">
            <ProfileButton />
            {/* Active indicator for profile */}
            {activePath.startsWith("/profile") && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-purple-600 z-10"></div>
            )}
          </div>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
            Profile
            {activePath.startsWith("/profile") && " (active)"}
            {/* Tooltip pointer */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
