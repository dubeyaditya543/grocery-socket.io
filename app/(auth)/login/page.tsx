"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthPageFeaturesCard } from "@/components/web/AuthPageFeaturesCard";
import { useAuth } from "@/contexts/AuthContext";
import { LoginFormValues, loginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LoginPage() {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema as any),
    values: {
      email: "",
      password: "",
    },
  });

  async function handleLoginForm(data: LoginFormValues) {
    setServerError(null);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.message ?? "Login failed");
        return;
      }

      setAuth(json.data.user, json.data.accessToken);
      router.push("/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again");
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#131d24] p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl md:flex-row lg:max-w-5xl">
        <AuthPageFeaturesCard />

        <div className="flex w-fit flex-col items-center justify-center gap-4 bg-[#f3f6f5] p-6 sm:p-8 lg:p-10">
          <h1 className="self-start text-3xl font-semibold">
            Welcome Back,{" "}
            <span className="text-sm whitespace-nowrap">Enter your credentials to continue</span>
          </h1>
          <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_35px_-15px_rgba(0,0,0,0.06)] sm:p-8">
            {serverError && <p className="text-sm font-semibold text-red-500">{serverError}</p>}
            <CardContent>
              <form className="space-y-4" onSubmit={form.handleSubmit(handleLoginForm)}>
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
                        autoComplete="email webauthn"
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
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:cursor-pointer hover:text-slate-600"
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
                  {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                </Button>

                <div className="pt-1 text-center">
                  <p className="text-xs text-slate-500">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
                    >
                      Create account
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
