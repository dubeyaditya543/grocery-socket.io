import { getAutUserFromCookies } from "@/lib/serverAuth";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { List } from "@/lib/models/List";
import { MemberStack } from "@/components/web/MemberStack";
import { AddItemListContainer } from "@/components/web/AddItemListContainer";
import { Sidebar } from "@/components/web/Sidebar";
import { User } from "@/lib/models/User";
import { DisplayAllLists } from "@/components/web/DisplayAllLists";
import { LeaveGroupBtn } from "@/components/web/LeaveGroupBtn";
import { AddMemberBtn } from "@/components/web/AddMemberBtn";
import { Cart } from "@/components/web/Cart";
import { GroupSocketListener } from "@/components/web/GroupSocketListener";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddMemberCard } from "@/components/web/AddMemberCard";

interface Params {
  params: Promise<{ groupId: string }>;
}

export default async function GroupDetailsPage({ params }: Params) {
  const user = await getAutUserFromCookies();
  if (!user) {
    redirect("/login");
  }

  const { groupId } = await params;
  if (!mongoose.isValidObjectId(groupId)) {
    notFound();
  }

  await connectDB();
  const rawGroup = await Group.findOne({ _id: groupId, members: user.userId })
    .populate("members", "fullName avatarUrl")
    .populate("createdBy", "fullName avatarUrl")
    .lean();

  if (!rawGroup) {
    notFound();
  }

  const group = {
    ...rawGroup,
    groupName: rawGroup?.groupName.replace(
      /(^|[^a-zA-Z])([a-zA-Z])/g,
      (_, separtor, letter) => separtor + letter.toUpperCase(),
    ),
  };

  const rawLists = await List.find({ group: group._id })
    .populate("createdBy", "fullName avatarUrl")
    .lean();

  const lists = rawLists.map((list) => ({
    ...list,
    listName: list.listName.replace(
      /(^|[^a-zA-Z])([a-zA-Z])/g,
      (_, separator, letter) => separator + letter.toUpperCase(),
    ),
  }));

  const groupsData = await Group.aggregate([
    {
      $match: {
        members: new mongoose.Types.ObjectId(user.userId),
      },
    },
    {
      $lookup: {
        from: "lists",
        localField: "_id",
        foreignField: "group",
        as: "lists",
      },
    },
    {
      $lookup: {
        from: "items",
        localField: "lists._id",
        foreignField: "list",
        as: "items",
      },
    },
    {
      $project: {
        _id: 0,
        groupId: "$_id",
        totalItems: { $size: "$items" },
        markedItems: {
          $size: {
            $filter: {
              input: "$items",
              as: "item",
              cond: { $eq: ["$$item.purchased", true] },
            },
          },
        },
      },
    },
  ]);

  const groupData = groupsData.find((grp) => grp.groupId.toString() === group._id!.toString());
  const totalItems = groupData?.totalItems ?? 0;
  const purchasedItems = groupData?.markedItems ?? 0;

  const loggedInUser = await User.findById(user.userId).lean();
  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7f6] text-slate-900">
      <Sidebar loggedInUser={JSON.parse(JSON.stringify(loggedInUser))} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="relative flex-1 overflow-y-auto p-6 pb-28 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {group.groupName}
              </h1>
              <GroupSocketListener groupId={group._id!.toString()} />
            </div>

            <div className="flex items-center gap-3">
              <MemberStack members={JSON.parse(JSON.stringify(group.members))} />

              <Popover>
                <PopoverTrigger render={<AddMemberBtn />} />
                <PopoverContent>
                  <AddMemberCard groupId={group._id.toString()} groupName={group.groupName} />
                </PopoverContent>
              </Popover>

              <LeaveGroupBtn groupId={group._id!.toString()} />
            </div>
          </div>

          {/* Add Item Bar Container */}
          <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
            <AddItemListContainer groupId={groupId} lists={JSON.parse(JSON.stringify(lists))} />
          </div>

          {/* Grocery Items List */}
          <DisplayAllLists lists={JSON.parse(JSON.stringify(lists))} />
        </main>

        {/* Floating Bottom Trip Summary / Cart Bar */}
        <Cart totalItems={totalItems} purchasedItems={purchasedItems} />
      </div>
    </div>
  );
}
