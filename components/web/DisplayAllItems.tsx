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
  const rawItems = await Item.find({ list: list._id })
    .populate("addedBy", "fullName avatarUrl")
    .lean();

  const items = rawItems.map((item) => ({
    ...item,
    itemName: item.itemName.replace(
      /(^|[^a-zA-Z])([a-zA-Z])/g,
      (_, separator, letter) => separator + letter.toUpperCase(),
    ),
  }));

  return (
    <>
      <ShowListName groupId={list.group} listId={list._id} listName={list.listName} />
      <div className="container flex w-full flex-col gap-4 rounded-md bg-gray-200 px-4 py-4">
        {items.length === 0 ? (
          <span className="py-4 text-center font-semibold">Nothing to show here</span>
        ) : (
          items.map((item) => (
            <ItemContainer key={item._id.toString()} item={JSON.parse(JSON.stringify(item))} />
          ))
        )}
      </div>
    </>
  );
}
