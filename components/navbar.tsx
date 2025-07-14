import Link from "next/link";
import { Home, SquarePlus, User, Search } from "lucide-react";

const navItems = [
  {
    href: "/explore",
    label: "Explore",
    icon: <Home strokeWidth={2.4} />, // Home icon
    color: "text-black hover:bg-gray-200 hover:text-black",
    tooltip: "Home / Explore",
  },

  {
    href: "/create",
    label: "Create",
    icon: <SquarePlus strokeWidth={2.4} />, // Plus icon
    color: "text-black hover:bg-gray-200 hover:text-black",
    tooltip: "Create Prompt",
  },
  {
    href: "/search",
    label: "search",
    icon: <Search strokeWidth={2.4} />, // Home icon
    color: "text-black hover:bg-gray-200 hover:text-black",
    tooltip: "Search",
  },
  {
    href: "/logout",
    label: "Logout",
    icon: <User strokeWidth={2.4} />, // LogOut icon
    color: "text-black hover:bg-gray-200 hover:text-black",
    tooltip: "Logout",
  },
];

const Navbar = () => {
  return (
    <nav className="h-full w-full flex flex-col items-center py-8 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100">
      <ul className="flex flex-col gap-5 w-full items-center">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">
            PV
          </span>
        </div>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <li
            key={item.href}
            className="w-full flex justify-center group relative"
          >
            <Link
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 ease-in-out ${item.color} hover:shadow-lg hover:scale-105 transform`}
            >
              {/* Navigation Icon */}
              <div className="text-gray-600 group-hover:text-purple-600 transition-colors">
                {item.icon}
              </div>

              {/* Animated Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                {item.tooltip}
                {/* Tooltip pointer */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
