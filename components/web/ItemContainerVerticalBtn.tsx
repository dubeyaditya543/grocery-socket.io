"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteItemAction } from "@/lib/actions/item-action";

interface ItemContainerVerticalBtnProps {
  listId: string;
  itemId: string;
  setIsItemNameEditable: (value: boolean) => void;
  setIsQuantityEditable: (value: boolean) => void;
}

export function ItemContainerVerticalBtn({
  listId,
  itemId,
  setIsItemNameEditable,
  setIsQuantityEditable,
}: ItemContainerVerticalBtnProps) {
  const params = useParams<{ groupId: string }>();
  const { user, accessToken } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        setIsItemNameEditable(false);
        setIsQuantityEditable(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsItemNameEditable, setIsQuantityEditable]);

  

  if (!user) {
    return null;
  }

  async function handleDelete() {
    setServerError(null);
    try {
      const res = await deleteItemAction(accessToken, params.groupId, listId, itemId);

      if (!res.success) {
        setServerError(res.error ?? "Something went wrong");
        return;
      }
    } catch {
      setServerError("Something went wrong while deleting");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="text-slate-600 hover:cursor-pointer hover:text-slate-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setIsItemNameEditable(true)}
        >
          Edit Name
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setIsQuantityEditable(true)}
        >
          Edit Quantity
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-500 hover:cursor-pointer">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
