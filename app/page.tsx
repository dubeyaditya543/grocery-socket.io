import Link from "next/link";
import { ShoppingBag, Radio, Bell, Users, Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// todo: refactor the file. try to split it into components

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f8faf9] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Header / Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-950/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0c5443] text-white shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Basket<span className="text-[#0c5443]">Sync</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link href="/signup">
              <Button className="h-9 rounded-xl bg-[#0c5443] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#084235]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#ebf5f0] via-[#f4f9f6] to-[#f8faf9] px-4 pt-12 pb-20 sm:px-8 sm:pt-20 lg:pb-28">
        {/* Subtle Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-175 -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Column: Headline & Call To Action */}
            <div className="space-y-6 lg:col-span-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.12]">
                Smart Grocery Shopping, <span className="text-[#0c5443]">Synced in Real Time</span>
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
                Real-time collaborative grocery shopping SaaS application for coordinating
                effortlessly with family, roommates, and groups.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/signup">
                  <Button className="h-12 rounded-xl bg-[#0c5443] px-7 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#094738]">
                    Create a Free List
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 bg-white px-7 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50"
                  >
                    Join with Code
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <Image
                    className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    width="48"
                    height={"48"}
                    alt="User 1"
                  />
                  <Image
                    className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    width="48"
                    height="48"
                    alt="User 2"
                  />
                  <Image
                    className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    width="48"
                    height="48"
                    alt="User 3"
                  />
                  <Image
                    className="inline-block h-8 w-8 rounded-full object-cover ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    width="48"
                    height="48"
                    alt="User 4"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">Social proof</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D-Angled Floating Mockup Visual */}
            <div className="relative flex items-center justify-center lg:col-span-6">
              {/* Floating Shopping Cart Badge */}
              <div className="absolute -top-3 left-4 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl ring-4 shadow-emerald-600/30 ring-white transition-transform duration-300 hover:scale-105 sm:top-1/4 sm:-left-3">
                <ShoppingCart className="h-7 w-7" />
              </div>

              {/* Floating Live User Avatar */}
              <div className="absolute right-4 -bottom-3 z-20 flex items-center gap-2.5 rounded-full border border-white/80 bg-white/95 px-3.5 py-2 shadow-xl backdrop-blur-md">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                    className="h-7 w-7 rounded-full object-cover"
                    alt="Active shopper" width={"48"} height={"48"}
                  />
                  <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-semibold text-slate-800">Emma</span>
                  <span className="block text-[10px] font-medium text-emerald-600">
                    Checked off 2 items
                  </span>
                </div>
              </div>

              {/* Realistic Mockup App Card */}
              <div className="relative w-full max-w-md rotate-1 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl transition-all duration-300 hover:rotate-0">
                {/* Header inside Mockup Card */}
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                      Live Sync
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">Home Groceries 🛒</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <Image
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                        alt="Avatar" width={"48"} height={"48"}
                      />
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                        className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
                        alt="Avatar" width={"48"} height={"48"}
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="no-scrollbar mb-4 flex items-center gap-1.5 overflow-x-auto text-xs font-medium text-slate-600">
                  <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">All Items</span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
                    Produce
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
                    Dairy & Eggs
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
                    Bakery
                  </span>
                </div>

                {/* Checklist Rows */}
                <div className="space-y-2.5">
                  {/* Item 1 - Checked */}
                  <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0c5443] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium text-slate-500 line-through">
                        Organic Greek Yogurt
                      </span>
                    </div>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      2x
                    </span>
                  </div>

                  {/* Item 2 - Checked */}
                  <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#0c5443] text-white">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium text-slate-500 line-through">
                        Almond Milk Unsweetened
                      </span>
                    </div>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      1L
                    </span>
                  </div>

                  {/* Item 3 - Unchecked */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-md border-2 border-slate-300" />
                      <span className="text-sm font-medium text-slate-800">
                        Artisan Sourdough Loaf
                      </span>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      500g
                    </span>
                  </div>

                  {/* Item 4 - Unchecked */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-md border-2 border-slate-300" />
                      <span className="text-sm font-medium text-slate-800">
                        Fresh Hass Avocados
                      </span>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      4x
                    </span>
                  </div>
                </div>

                {/* Card Progress Footer */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
                  <span>2 of 4 items collected</span>
                  <span className="font-semibold text-emerald-700">50% Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="border-t border-slate-200/80 bg-white px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
              Features
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for seamless grocery coordination
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Say goodbye to double purchases and forgotten groceries with instant multi-device
              syncing.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#fbfdfc] p-7 transition-all duration-200 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/80 text-[#0c5443]">
                <Radio className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Real-time Socket Sync</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Instantly sync list items across every phone and computer the millisecond someone
                checks an item off or adds a new ingredient.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#fbfdfc] p-7 transition-all duration-200 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/80 text-[#0c5443]">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Notifications</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Get notified when family members arrive at the supermarket or add last-minute items
                to your active grocery run.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-[#fbfdfc] p-7 transition-all duration-200 hover:shadow-lg">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100/80 text-[#0c5443]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Group Sharing</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Create multiple dedicated group lists for your household, weekend BBQ, roommates,
                and holiday events with 1-click invite codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="border-t border-slate-200/80 bg-[#f4f8f6] px-4 py-20 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
              Workflow
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple 3-step setup in under 30 seconds
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c5443] text-base font-bold text-white">
                1
              </span>
              <h3 className="text-lg font-bold text-slate-900">Create a Group List</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Set up a list like &quot;Home Groceries&quot; or &quot;Roommates Pantry&quot; with
                organized food categories.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c5443] text-base font-bold text-white">
                2
              </span>
              <h3 className="text-lg font-bold text-slate-900">Share with 8-Digit Code</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Send a quick join code or invite link to everyone in your house. No complicated
                setup required.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#0c5443] text-base font-bold text-white">
                3
              </span>
              <h3 className="text-lg font-bold text-slate-900">Shop Together in Real Time</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Divide and conquer aisle by aisle. As soon as someone grabs milk, your screen
                updates instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="px-4 py-16 sm:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-linear-to-br from-[#0c5443] via-[#094738] to-[#053227] p-8 text-center text-white shadow-2xl sm:p-14">
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 mx-auto w-full space-y-6">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to streamline your grocery trips?
            </h2>
            <p className="text-sm text-emerald-100/80 sm:text-base">
              Join thousands of households enjoying stress-free shopping with real-time socket
              lists.
            </p>
            <div className="pt-2">
              <Link href="/signup">
                <Button className="h-12 rounded-xl bg-white px-8 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100">
                  Create Your Free List Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0c5443] text-white shadow-xs">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-slate-900">
              Basket<span className="text-[#0c5443]">Sync</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} BasketSync. All rights reserved. Real-time
            collaborative grocery shopping.
          </p>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="#features" className="hover:text-slate-900">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-slate-900">
              How it Works
            </Link>
            <Link href="/login" className="hover:text-slate-900">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-slate-900">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
