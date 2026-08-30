"use client";

import { useListStore } from "@/lib/store/list-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface ListDropdownProps {
  lists: Array<{
    _id: string;
    listName: string;
    createdBy: {
      fullName: string;
      avatarUrl: string;
    };
  }>;
  value?: string,
  onValueChange: (value: string) => void
  invalid?: boolean
}

export function ListDropdown({ lists, value, onValueChange, invalid }: ListDropdownProps) {
  const setCurrentList = useListStore((state) => state.setCurrentList);

  const listItems = lists.map((list) => ({
    label: list.listName.replace(
      /(^|[^a-zA-Z])([a-zA-Z])/g,
      (_, separator, letter) => separator + letter.toUpperCase(),
    ),
    value: list._id,
  }));

  function handleSelect(selectedId: string | null) {
    if (!selectedId) return;
    const selected = lists.find((list) => list._id === selectedId);
    if (selected) {
      setCurrentList(selected);
    }
  }

  return (
    <div className="sm:col-span-3">
      <Select items={listItems} onValueChange={(v) => {onValueChange(v ?? ""); handleSelect(v)}} value={value ?? ""}>
        <SelectTrigger aria-invalid={invalid} className={"w-full"}>
          <SelectValue placeholder={"Choose a list"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {listItems.map((listItem) => (
              <SelectItem key={listItem.value} value={listItem.value}>
                {listItem.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
