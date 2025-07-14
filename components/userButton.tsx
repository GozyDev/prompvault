import { User } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function UserPCard({
  user,
  color,
  textColor
}: {
  user: { email: string; imageUrl: string; name: string },
  color:string
  textColor:string
}) {
  const [userDetails, setUser] = useState(user);

  const email = userDetails?.email;
  const initials = email ? email.slice(0, 2).toUpperCase() : "";

  return (
    <div
      className="flex items-center gap-2  rounded-full  "
      aria-label="Profile"
    >
      {userDetails.imageUrl ? (
        <Image
          src={userDetails.imageUrl}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full object-cover w-10 h-10"
        />
      ) : (
        <span className={`${color}  rounded-full w-10 h-10 flex items-center justify-center text-white `}>
          {initials || <User className="w-4 h-4 text-gray-500" />}
        </span>
      )}
      {userDetails.name && (
        <span className={`font-bold ${textColor} text-md truncate cursive  tracking-tight`}>
          {userDetails.name}
        </span>
      )}
    </div>
  );
}
