import { Clock, Users } from "lucide-react";

export function AuthPageFeaturesCard() {
  return (
    <div className="bg-lineaar-to-br relative flex w-full flex-col items-center justify-center overflow-hidden from-[#0c5443] via-[#094738] to-[#053227] p-8 sm:p-10 md:w-1/2 lg:p-12">
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm space-y-5">
        <div className="rounded-2xl border border-white/12 bg-white/8 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-white/18 hover:bg-white/11 sm:p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/12 text-emerald-200">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-base font-semibold tracking-tight text-white sm:text-lg">
            Share shopping lists with family
          </h3>
          <p className="text-xs leading-relaxed text-emerald-100/70 sm:text-sm">
            Share shopping lists with home, friends and collegues.
          </p>
        </div>

        <div className="rounded-2xl border border-white/12 bg-white/8 p-5 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-white/18 hover:bg-white/11 sm:p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/12 text-emerald-200">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="mb-1 text-base font-semibold tracking-tight text-white sm:text-lg">
            Real-time updates as you shop
          </h3>
          <p className="text-xs leading-relaxed text-emerald-100/70 sm:text-sm">
            Real-time updates for your grocery lists.
          </p>
        </div>
      </div>
    </div>
  );
}
