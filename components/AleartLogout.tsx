import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AlertLogOut() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const logOutResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        { credentials: "include", method: "POST" }
      );
      if (!logOutResponse.ok) {
        const errorBody = await logOutResponse.json();
        toast.error(errorBody || "Logout failed try again later");
      } else {
        const dataBody = await logOutResponse.json();
        toast.success("succes");
        setTimeout(() => {
          router.push("/signIn");
        }, 800);
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed try again later");
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <li className="group relative cursor-pointer my-2 transition-all duration-200 hover:bg-gray-100 rounded-lg p-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <LogOut className="text-gray-600" />

              {/* Animated tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-xl backdrop-blur-sm transition-all duration-300 transform group-hover:translate-x-0 -translate-x-2">
                logout
              </div>
            </div>
          </div>
        </li>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-2xl border-0 bg-gradient-to-br from-white to-gray-50 shadow-xl">
        <div className="p-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>

          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl font-bold text-gray-800">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600">
              Are you sure you want to log out? You'll need to sign back in to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex flex-col-reverse  sm:flex-row-reverse sm:space-x-4 sm:space-x-reverse">
            <AlertDialogAction
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-md cursor-pointer"
            >
              Logout
            </AlertDialogAction>
            <AlertDialogCancel className="w-full sm:w-auto mt-2 sm:mt-0 bg-gray-300 hover:bg-gray-400 border-none cursor-pointer">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
