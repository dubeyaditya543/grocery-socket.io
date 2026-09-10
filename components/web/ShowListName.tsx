"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { MoreVertical, MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { deleteListAction, patchListAction } from "@/lib/actions/list-action";

interface ShowListNameProps {
  listName: string;
  groupId: string;
  listId: string;
}

export function ShowListName({ listName, groupId, listId }: ShowListNameProps) {
  const { accessToken } = useAuth();
  const [isListEditable, setIsListEditable] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>(listName);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsListEditable(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsListEditable]);

  async function handleListEdit() {
    try {
      const formData = new FormData();
      formData.append("listName", newListName);

      const response = await patchListAction(
        accessToken,
        groupId,
        listId,
        { success: false },
        formData,
      );

      if (!response.success) {
        return;
      }

      setIsListEditable(false)
    } catch {
      console.error("Something went wrong");
    }
  }

  async function handleDelete(){
    try{
      const response = await deleteListAction(accessToken, groupId, listId)
      if(!response.success){
        return
      }
    }catch {
      console.error("Something went wrong")
    }
  }

  return (
    <>
      {isListEditable ? (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="w-48"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <Button
            className={"w-fit cursor-pointer bg-green-700 text-sm font-semibold hover:bg-green-800"}
            onClick={handleListEdit}
          >
            Save
          </Button>
          <Button
            className={"w-fit cursor-pointer bg-red-700 text-sm font-semibold hover:bg-red-800"}
            onClick={() => setIsListEditable(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold">{listName}</h3>
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
                onClick={() => setIsListEditable(true)}
              >
                Edit Name
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 hover:cursor-pointer" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
}
