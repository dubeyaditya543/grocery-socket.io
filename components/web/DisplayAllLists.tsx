import { Item } from "@/lib/models/Item";
import { DisplayAllItems } from "./DisplayAllItems";
import { EmptyItemsState } from "./EmptyItemsState";

interface ListItemsProps {
  lists: Array<{
    _id: string;
    listName: string;
    createdBy: {
      _id: string;
      fullName: string;
      avatarUrl: string;
    };
  }>;
}

export async function DisplayAllLists({ lists }: ListItemsProps) {
  if (!lists || lists.length === 0) {
    return <EmptyItemsState hasLists={false} />;
  }

  const listIds = lists.map((list) => list._id);
  const totalItemsCount = await Item.countDocuments({ list: { $in: listIds } });

  if (totalItemsCount === 0) {
    return <EmptyItemsState hasLists={true} />;
  }

  return (
    <div className="space-y-3">
      {lists.map((list) => (
        <DisplayAllItems key={list._id} list={list} />
      ))}
    </div>
  );
}
