"use client";

import { useAuth } from "@/contexts/AuthContext";
import { RegisterFormValues, registerSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { Users, Clock, Eye, EyeOff } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [serverError, setServerError] = useState<string | null>("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema as any),
    values: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#131d24] p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl md:flex-row lg:max-w-5xl">
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
                Share shopping lists with home, ios and non scalable en groocs.
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

        <div className="flex w-full items-center justify-center bg-[#f3f6f5] p-6 sm:p-8 md:w-1/2 lg:p-10">
          <div className="w-full max-w-95 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.06)] sm:p-8">
            <CardContent>
              <form className="space-y-4">
                <Controller
                  name="fullName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium text-slate-700 sm:text-sm"
                      >
                        Full Name
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Full Name"
                        autoComplete="name"
                        className="h-10 rounded-lg border-slate-200 bg-white px-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium text-slate-700 sm:text-sm"
                      >
                        Email Address
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Email Address"
                        autoComplete="email"
                        className="h-10 rounded-lg border-slate-200 bg-white px-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-xs font-medium text-slate-700 sm:text-sm"
                      >
                        Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          aria-invalid={fieldState.invalid}
                          placeholder="Password"
                          autoComplete="current-password"
                          className="h-10 rounded-lg border-slate-200 bg-white pr-10 pl-3.5 text-sm placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-1 h-10 w-full rounded-lg bg-[#111827] text-sm font-medium text-white shadow-sm transition-all duration-150 hover:cursor-pointer hover:bg-black/80"
                >
                  {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="pt-1 text-center">
                  <p className="text-xs text-slate-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}
