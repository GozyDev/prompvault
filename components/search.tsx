"use client";
import { Search as SearchIcon } from "lucide-react";
import ProfileButton from "./profileButton";

export default function Search() {
  return (
    <div className="hidden  md:flex items-center w-full gap-4">
      <form className="flex items-center flex-1 bg-white dark:bg-gray-800 rounded-2xl px-5 py-3  border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all duration-200">
        <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
        <input
          type="text"
          className="flex-1 outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base py-1 tracking-wide"
          placeholder="Search for anything..."
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Search"
        >
          <SearchIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </form>
      <ProfileButton />
    </div>
  );
}
