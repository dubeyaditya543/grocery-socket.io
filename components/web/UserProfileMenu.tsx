import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { UserProfileBtn } from "./UserProfileBtn";

export function UserProfileMenu(){
  return <DropdownMenu>
    <DropdownMenuTrigger render={<UserProfileBtn />} />
  </DropdownMenu>
}