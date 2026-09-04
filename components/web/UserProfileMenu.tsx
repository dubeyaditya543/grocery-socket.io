"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserProfileBtn } from "./UserProfileBtn";
import { redirect } from "next/navigation";

export function UserProfileMenu() {

  async function handleLogout(){
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    })
    redirect("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<UserProfileBtn />} />
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
