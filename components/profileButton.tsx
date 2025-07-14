"use client";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import getUser from "@/components/me";
import { useEffect, useState } from "react";

interface ProfileButtonProps {
  imageUrl?: string;
  username?: string;
  href?: string;
}

interface UserType {
  email?: string;
  imageUrl?: string;
  // add other user properties if needed
}

export default function ProfileButton({
  imageUrl,
  username,
  href = "/profile",
}: ProfileButtonProps) {
  const [user, setUser] = useState<UserType | undefined>(undefined);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const email = user?.email;
  const initials = email ? email.slice(0, 2).toUpperCase() : "";
  const imageurl = user?.imageUrl


  return (
    <Link
      href={href}
      className="flex items-center gap-2  rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
      aria-label="Profile"
    >
      {imageurl ? (
        <Image
          src={imageurl}
          alt={username || "Profile"}
          width={32}
          height={32}
          className="rounded-full object-cover w-10 h-10"
        />
      ) : (
        <span className="bg-pink-700 rounded-full w-10 h-10 flex items-center justify-center text-white">
          {initials || <User className="w-5 h-5 text-gray-500" />}
        </span>
      )}
      {username && (
        <span className="font-medium text-gray-800 text-sm">{username}</span>
      )}
    </Link>
  );
}
