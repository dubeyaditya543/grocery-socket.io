import { Item } from "@/lib/models/Item";
import { ItemContainer } from "./ItemContainer";

interface DisplayAllItemsProps {
  list: {
    _id: string;
    listName: string;
    createdBy: {
      fullName: string;
      avatarUrl: string;
    };
  };
}

export async function DisplayAllItems({ list }: DisplayAllItemsProps) {
  const items = await Item.find({ list: list._id }).populate("addedBy", "fullName avatarUrl").lean();
  if (items.length === 0) {
    return;
  }

  return (
    <>
    <h3 className="text-2xl font-semibold">{list.listName}</h3>
      {items.length > 0 &&
        items.map((item) => (
          <ItemContainer key={item._id.toString()} item={JSON.parse(JSON.stringify(item))} />
        ))}
    </>
  );
}
