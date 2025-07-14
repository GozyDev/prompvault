"use client";
import { Home, Search, SquarePlus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/explore", icon: Home, label: "Explore" },
  { href: "/create", icon: SquarePlus, label: "Create" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function MobileNavBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-[80px] md:hidden">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform -translate-y-3"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-label={label}
          >
            <div className="relative">
              <Icon
                className={`w-6 h-6 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
              />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></span>
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                isActive ? "text-white" : ""
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
