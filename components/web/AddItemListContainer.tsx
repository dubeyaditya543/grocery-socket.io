"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ItemFormValues, itemSchema } from "@/lib/validations/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { ListDropdown, ListDropdownProps } from "./ListDropdown";
import { createItemAction } from "@/lib/actions/item-action";
import { useListStore } from "@/lib/store/list-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CreateListBtn } from "./CreateListBtn";
import { CreateListCard } from "./CreateListCard";

interface AddItemProps {
  groupId: string;
  lists: ListDropdownProps;
}

export function AddItemListContainer({ groupId, lists }: AddItemProps) {
  const { user, accessToken } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema as any),
    values: {
      itemName: "",
      listId: "",
      quantity: 1,
    },
  });

  if (!user) {
    return null;
  }

  async function handleAddItem(data: ItemFormValues) {
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("itemName", data.itemName);
      formData.append("listId", data.listId);
      formData.append("quantity", (data.quantity ?? 1).toString());

      const res = await createItemAction(
        accessToken,
        groupId,
        data.listId,
        { success: false },
        formData,
      );

      if (!res.success) {
        setServerError(res.error ?? "Something went wrong");
        return;
      }

      form.reset();
    } catch {
      setServerError("Something went wrong");
    }
  }

  return (
    <>
      {serverError && (
        <p className="container px-4 py-2 rounded-lg mb-2 bg-red-600 font-semibold text-white">{serverError}</p>
      )}
      <form
        className="grid grid-cols-1 gap-2.5 pr-4 sm:grid-cols-13 sm:items-center"
        onSubmit={form.handleSubmit(handleAddItem)}
      >
        <div className="sm:col-span-5">
          <Controller
            name="itemName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="text"
                placeholder="[ Item Name ]"
                className="h-10 rounded-xl px-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:ring-emerald-500/20"
                aria-invalid={fieldState.invalid}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="quantity"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="number"
                placeholder="Quantity"
                className="h-10 rounded-xl px-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:ring-emerald-500/20"
                aria-invalid={fieldState.invalid}
              />
            )}
          />
        </div>

        <div className="sm:col-span-2">
          <Controller
            name="listId"
            control={form.control}
            render={({ field, fieldState }) => (
              <ListDropdown
                lists={JSON.parse(JSON.stringify(lists))}
                value={field.value}
                onValueChange={field.onChange}
                invalid={fieldState.invalid}
              />
            )}
          />
        </div>

        <div className="flex w-fit items-center gap-2 sm:col-span-2">
          <Button
            type="submit"
            className="h-10 w-full gap-1.5 rounded-md bg-[#257a66] px-4 text-sm font-semibold text-white shadow-xs transition hover:cursor-pointer hover:bg-[#229276]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
          <Popover>
            <PopoverTrigger render={<CreateListBtn />} />
            <PopoverContent>
              <CreateListCard groupId={groupId} />
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </>
  );
}
