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

  return (
    <>
      <ShowListName groupId={list.group} listId={list._id} listName={list.listName} />
      <div className="container flex w-full flex-col gap-4 rounded-md bg-gray-200 px-4 py-4">
        {items.length === 0 ? (
          <span className="font-semibold text-center py-4">Nothing to show here</span>
        ) : (
          items.map((item) => (
            <ItemContainer key={item._id.toString()} item={JSON.parse(JSON.stringify(item))} />
          ))
        )}
      </div>
    </>
  );
}
