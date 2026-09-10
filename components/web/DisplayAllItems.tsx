import { Item } from "@/lib/models/Item";
import { ItemContainer } from "./ItemContainer";
import { ShowListName } from "./ShowListName";

interface DisplayAllItemsProps {
  list: {
    _id: string;
    listName: string;
    group: string;
    createdBy: {
      fullName: string;
      avatarUrl: string;
    };
  };
}

export async function DisplayAllItems({ list }: DisplayAllItemsProps) {
  const items = await Item.find({ list: list._id })
    .populate("addedBy", "fullName avatarUrl")
    .lean();
  if (items.length === 0) {
    return;
  }

  return (
    <>
      <ShowListName groupId={list.group} listId={list._id} listName={list.listName} />
      {items.length > 0 &&
        items.map((item) => (
          <ItemContainer key={item._id.toString()} item={JSON.parse(JSON.stringify(item))} />
        ))}
    </>
  );
}
