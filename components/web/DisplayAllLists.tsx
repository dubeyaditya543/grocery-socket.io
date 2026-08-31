import { DisplayAllItems } from "./DisplayAllItems";

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

export function DisplayAllLists({ lists }: ListItemsProps) {
  return (
    <div className="space-y-3">
      {lists.map((list) => (
        <DisplayAllItems key={list._id} list={list} />
      ))}
    </div>
  );
}
