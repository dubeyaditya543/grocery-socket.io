import Link from "next/link";
import { ShoppingBag, Users, ListTodo, History, Settings, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CreateGroupForm } from "@/components/web/CreateGroupForm";
import { CreateGroupBtn } from "@/components/web/CreateGroupBtn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { JoinGroupBtn } from "@/components/web/JoinGroupBtn";
import { JoinGroupCard } from "@/components/web/JoinGroupCard";
import { connectDB } from "@/lib/db";
import { getAutUserFromCookies } from "@/lib/serverAuth";
import { Group } from "@/lib/models/Group";
import { redirect } from "next/navigation";
import { GroupCard } from "@/components/web/GroupCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default async function DashboardPage() {
  await connectDB();

  const user = await getAutUserFromCookies();
  if (!user) {
    redirect("/login");
  }

  const groups = await Group.find({ members: user.userId })
    .populate("createdBy", "fullName avatarUrl")
    .populate("members", "fullName avatarUrl")
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
              width={"48"}
              height={"48"}
            />
            <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111822]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">User Profile</p>
            <p className="truncate text-xs text-slate-400">aditya@example.com</p>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search"
              className="h-10 rounded-xl border-slate-200 bg-slate-50 pr-24 pl-10 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:ring-emerald-500/20"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-400">
              Shortcut 1.9
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                2
              </span>
            </button>

            {/* Create New Group Button */}
            <Popover>
              <PopoverTrigger render={<CreateGroupBtn />} />
              <PopoverContent>
                <CreateGroupForm />
              </PopoverContent>
            </Popover>

            {/* Join with Code Button */}
            <Popover>
              <PopoverTrigger render={<JoinGroupBtn />} />
              <PopoverContent>
                <JoinGroupCard />
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Group Cards</h1>
              <p className="text-xs text-slate-500">
                Manage all your collaborative shopping groups in one place
              </p>
            </div>
          </div>

          {/* Empty State Card - "You are not in any group" */}
          <div className="relative flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
            {groups.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {groups.map((group) => (
                  <GroupCard group={JSON.parse(JSON.stringify(group))} key={group._id.toString()} />
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#0c5443] ring-8 ring-emerald-50/50">
                  <Users className="h-8 w-8" />
                </div>

                <h2 className="text-xl font-bold text-slate-900">You are not in any group</h2>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
                  Join an existing group with an 8-digit code or create a new group to start sharing
                  real-time grocery lists with your household.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Dialog>
                    <DialogTrigger render={<CreateGroupBtn />} />
                    <DialogContent className="border-none bg-transparent p-0">
                      <CreateGroupForm />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger render={<JoinGroupBtn />} />
                    <DialogContent className="border-none bg-transparent p-0">
                      <JoinGroupCard />
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
