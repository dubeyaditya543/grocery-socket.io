"use client"

import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { JoinGroupFormValues, joinGroupSchema } from "@/lib/validations/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function JoinGroupCard() {
  const { user, accessToken } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<JoinGroupFormValues>({
    resolver: zodResolver(joinGroupSchema as any),
    values: {
      joinCode: "",
    },
  });

  async function handleJoinGroupFormSubmit(data: JoinGroupFormValues) {
    setServerError(null);
    try{
      const res = await fetch(`/api/v1/group/join/${data.joinCode}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      })

      const json = await res.json()
      if(!res.ok){
        setServerError(json.message ?? "Error while joingin group")
      }
    }catch{
      setServerError("Something went wrong. Please try again")
    }
  }

  if(!user){
    return null
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Join Group</CardTitle>
        </CardHeader>
        <CardContent>
          {serverError && (
            <p className="container font-semibold text-red-500">{serverError}</p>
          )}
          <form onSubmit={form.handleSubmit(handleJoinGroupFormSubmit)}  className="space-y-4">
            <Controller
              name="joinCode"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Group Code</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} placeholder="Code" />
                </Field>
              )}
            />
            <Button
              type="submit"
              className={
                "mx-auto flex cursor-pointer self-center bg-green-700/90 hover:bg-green-800/80"
              }
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Joining..." : "Join"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
