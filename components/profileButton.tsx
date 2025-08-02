"use client";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import getUser from "@/components/me";
import { useEffect, useState } from "react";

interface UserType {
  email?: string;
  imageUrl?: string;
  id: string;
  name?: string; // Added name field
}

export default function ProfileButton() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData || null);
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-full bg-gray-100 w-10 h-10">
        <div className="animate-pulse rounded-full bg-gray-200 w-8 h-8" />
      </div>
    );
  }

  // Fallback if user is null
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm w-10 h-10"
        aria-label="Login"
      >
        <User className="w-5 h-5 text-gray-500" />
      </Link>
    );
  }

  const initials = user.name 
    ? user.name.slice(0, 2).toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || "US";

  return (
    <Link
      href={`/profile/${user.id}`}
      className="flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm w-8 h-8"
      aria-label="Profile"
    >
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.name || "Profile"}
          width={40}
          height={40}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-full h-full flex items-center justify-center text-white text-xs font-medium">
          {initials}
        </span>
      )}
    </Link>
  );
}