import { History, ListTodo, Settings, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SidebarProps {
  loggedInUser: {
    fullName: string;
    avatarUrl: string;
    email: string;
  };
}

export function Sidebar({ loggedInUser }: SidebarProps) {
  return (
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
            src={
              loggedInUser.avatarUrl
                ? loggedInUser.avatarUrl
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            }
            alt="User Profile"
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
            width={48}
            height={48}
            loading="eager"
          />
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111822]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {loggedInUser && loggedInUser.fullName}
          </p>
          <p className="truncate text-xs text-slate-400">{loggedInUser && loggedInUser.email}</p>
        </div>
      </div>
    </aside>
  );
}
