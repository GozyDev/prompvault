import { useState } from "react";
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
import { Trash, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Delete({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const deletePrompt = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/prompt/${id}`,
        { credentials: "include", method: "DELETE" }
      );
      if (!deletePrompt.ok) {
        const errorBody = await deletePrompt.json();
        toast.error(errorBody);
      } else {
        const dataBody = await deletePrompt.json();
        toast.success("Deleted successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-2 rounded-full transition-all bg-red-200"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(true);
          }}
          aria-label="Delete account"
        >
          <Trash className="w-5 h-5 text-red-600" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md rounded-2xl bg-white border-none">
        <div className="p-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <Trash className="h-6 w-6 text-red-600" />
          </div>

          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Confirm Account Deletion
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-gray-600">
              This will permanently remove all your data from our servers.
              <span className="block mt-1 font-medium text-red-600">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row-reverse sm:space-x-4 sm:space-x-reverse">
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className={`w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-md cursor-pointer ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
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
