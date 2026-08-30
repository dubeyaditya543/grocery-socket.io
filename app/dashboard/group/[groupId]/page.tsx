import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Users,
  ListTodo,
  History,
  Settings,
  Check,
  ShoppingCart,
  UserPlus,
  MoreVertical,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAutUserFromCookies } from "@/lib/serverAuth";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Group } from "@/lib/models/Group";
import { List } from "@/lib/models/List";
import { MemberStack } from "@/components/web/MemberStack";
import { AddItemListContainer } from "@/components/web/AddItemListContainer";

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

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7f6] text-slate-900">
      {/* Left Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-[#111822] p-5 text-slate-300 md:flex">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0c5443] text-white shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Basket<span className="text-emerald-400">Sync</span>
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <Users className="h-4 w-4 text-emerald-400" />
              <span>My Groups</span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              <ListTodo className="h-4 w-4" />
              <span>Shared Lists</span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              <History className="h-4 w-4" />
              <span>Recent Activity</span>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* User Profile Bar at Bottom of Sidebar */}
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="User Profile"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
              width={48}
              height={48}
            />
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111822]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">User Profile</p>
            <p className="truncate text-xs text-slate-400">aditya@example.com</p>
          </div>
        </div>
      </aside>

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
          <div className="space-y-3">
            {/* Item 1 - Checked with Added by avatar */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0c5443] text-white">
                  <Check className="h-4 w-4 stroke-3" />
                </div>
                <span className="text-sm font-medium text-slate-500 line-through">
                  Organic Whole Milk
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Added by</span>
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Added by"
                    className="h-6 w-6 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Item 2 - Checked with Quantity & Weight Badges */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0c5443] text-white">
                  <Check className="h-4 w-4 stroke-3" />
                </div>
                <span className="text-sm font-medium text-slate-500 line-through">
                  Fresh Hass Avocados
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  2x
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  500g
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Item 3 - Unchecked with Category Badge */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300">
              <div className="flex items-center gap-3.5">
                <div className="h-6 w-6 shrink-0 rounded-lg border-2 border-slate-300" />
                <span className="text-sm font-medium text-slate-900">Artisan Sourdough Loaf</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  Bakery
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Item 4 - Completed Live Sync Item */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300">
              <div className="flex items-center gap-3.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0c5443] text-white">
                  <Check className="h-4 w-4 stroke-3" />
                </div>
                <span className="text-sm font-medium text-slate-500 line-through">
                  Greek Yogurt Plain
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  2x
                </span>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  500g
                </span>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  Completed
                </span>
                <Radio className="h-4 w-4 animate-pulse text-emerald-600" />
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Item 5 - Unchecked with Added by avatar */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:border-slate-300">
              <div className="flex items-center gap-3.5">
                <div className="h-6 w-6 shrink-0 rounded-lg border-2 border-slate-300" />
                <span className="text-sm font-medium text-slate-900">Extra Virgin Olive Oil</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Added by</span>
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Added by"
                    className="h-6 w-6 rounded-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
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
