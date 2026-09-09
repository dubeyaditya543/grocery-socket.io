import { ShoppingBag, Sparkles } from "lucide-react";

interface EmptyItemsStateProps {
  title?: string;
  description?: string;
  hasLists?: boolean;
}

export function EmptyItemsState({
  title = "No items in your lists yet",
  description = "Your lists are currently empty. Add groceries, ingredients, or supplies above to start collaborating in real-time.",
  hasLists = true,
}: EmptyItemsStateProps) {
  return (
    <div className="relative flex min-h-95 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-xs">
      {/* Icon Badge */}
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#0c5443] ring-8 ring-emerald-50/50">
        <ShoppingBag className="h-8 w-8" />
        <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0c5443] shadow-xs ring-1 ring-slate-200">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Text Content */}
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        {hasLists
          ? description
          : "You don't have any lists created yet. Create your first list using the selector above to begin adding items."}
      </p>

      {/* Helpful Hint / Input pointer */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600">
        <span>Type an item in the bar above to get started</span>
      </div>
    </div>
  );
}
