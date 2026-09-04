"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Check } from "lucide-react";
import { ItemContainerVerticalBtn } from "./ItemContainerVerticalBtn";
import { AvatarPic } from "./AvatarPic";
import { useState } from "react";
import { Input } from "../ui/input";
import { patchItemAction } from "@/lib/actions/item-action";
import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface ItemContainerProps {
  item: {
    _id: string;
    itemName: string;
    purchased: boolean;
    addedBy: {
      _id: string;
      fullName: string;
      avatarUrl: string;
    };
    list: string;
    quantity: number;
  };
}

export function ItemContainer({ item }: ItemContainerProps) {
  const params = useParams<{groupId: string}>()
  const { user, accessToken } = useAuth();
  const [newItemName, setNewItemName] = useState<string | null>(item.itemName);
  const [newQuantity, setQuantity] = useState<number | null>(item.quantity);
  const [purchased, setPurchased] = useState<boolean | null>(item.purchased)
  const [isItemNameEditable, setIsItemNameEditable] = useState<boolean>(false);
  const [isQuantityEditable, setIsQuantityEditable] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null)

  if (!user) {
    return;
  }

  async function handleEdit(){
    if(!newItemName && !newQuantity){
      return;
    }

    setServerError(null)

    try{
      const formData = new FormData()
      formData.append("itemName", newItemName ?? "")
      formData.append("quantity", (newQuantity ?? 0).toString())

      const res = await patchItemAction(accessToken, params.groupId, item.list, item._id, {success: false}, formData)

      if(!res.success){
        setServerError(res.error ?? "Soemthing went wrong while updating")
        return
      }

      setIsItemNameEditable(false)
      setIsQuantityEditable(false)
    }catch {
      setServerError("Something went wrong. Try again")
    }
  }

  async function handlePurchase(value: boolean){
    setServerError(null)

    try{
      const formData = new FormData()
      formData.append("purchased", value.toString())

      const res = await patchItemAction(accessToken, params.groupId, item.list, item._id, {success: false}, formData)

      if(!res.success){
        setServerError(res.error ?? "Something went wrong")
        return
      }
    }catch {
      setServerError("Something went wrong. Please try again")
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 p-4 shadow-xs transition hover:border-slate-300">
      <div className="flex items-center gap-3.5">
        <Checkbox
          checked={purchased ?? item.purchased}
          onCheckedChange={(checked) => {setPurchased(Boolean(checked)); handlePurchase(Boolean(checked))}}
          className={`flex hover:cursor-pointer h-6 w-6 shrink-0 items-center justify-center rounded-lg  text-white`}
        >
          {item.purchased && <Check className="h-4 w-4 stroke-3" />}
        </Checkbox>
        {isItemNameEditable ? (
          <Input value={newItemName ?? item.itemName} onChange={(e) => setNewItemName(e.target.value)} />
        ) : (
          <span
            className={`text-sm font-medium text-slate-500 ${(purchased ?? item.purchased) && "line-through"}`}
          >
            {item.itemName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {item.quantity ? (
          isQuantityEditable ? (
            <Input
              type="number"
              value={newQuantity ?? item.quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20"
            />
          ) : (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
              {item.quantity}x
            </span>
          )
        ) : null}

        {(isItemNameEditable || isQuantityEditable) && <Button onClick={handleEdit} className={"bg-green-800 text-white rounded-md hover:bg-green-900 hover:cursor-pointer font-semibold"}>Save</Button>}

        {item.addedBy?._id !== user.userId && item.addedBy && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-semibold">Added by</span>
            <AvatarPic
              _id={item.addedBy._id}
              fullName={item.addedBy.fullName}
              avatarUrl={item.addedBy.avatarUrl}
            />
          </div>
        )}

        <ItemContainerVerticalBtn
          itemId={item._id}
          listId={item.list}
          setIsItemNameEditable={setIsItemNameEditable}
          setIsQuantityEditable={setIsQuantityEditable}
        />
      </div>
    </div>
  );
}
