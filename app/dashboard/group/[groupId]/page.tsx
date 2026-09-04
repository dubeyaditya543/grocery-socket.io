import { ShoppingCart, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const group = await Group.findOne({ _id: groupId, members: user.userId })
    .populate("members", "fullName avatarUrl")
    .populate("createdBy", "fullName avatarUrl")
    .lean();

  if (!group) {
    notFound();
  }

  const lists = await List.find({ group: group._id })
    .populate("createdBy", "fullName avatarUrl")
    .lean();

  const loggedInUser = await User.findById(user.userId);
  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7f6] text-slate-900">
      {/* Left Sidebar */}
      <Sidebar loggedInUser={loggedInUser} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Page Content */}
        <main className="relative flex-1 overflow-y-auto p-6 pb-28 sm:p-8 lg:p-10">
          {/* Header Section */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            {/* Title & Live Status */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {group.groupName}
              </h1>
            </div>

            {/* Members Stack & Add Member Button */}
            <div className="flex items-center gap-3">
              <MemberStack members={JSON.parse(JSON.stringify(group.members))} />

              <Button className="h-10 gap-2 rounded-xl bg-[#0c5443] px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#094738]">
                <UserPlus className="h-4 w-4" />
                <span>Add Member</span>
              </Button>
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
        <div className="fixed bottom-6 left-1/2 z-30 w-[90%] max-w-2xl -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md md:left-[calc(50%+8rem)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <ShoppingCart className="h-5 w-5 text-[#0c5443]" />
              <span>Cart</span>
            </div>

            <div className="text-center text-xs text-slate-600">
              <span className="font-semibold text-slate-900">14 of 20</span> items collected • Total
              Est: <span className="font-bold text-slate-900">$48.50</span>
            </div>

            <Button className="h-9 rounded-xl bg-[#0c5443] px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-[#094738]">
              Complete Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
