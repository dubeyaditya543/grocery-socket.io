"use client";

import { GroupFormValues, groupSchema } from "@/lib/validations/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function CreateGroupCard() {
  const {user, accessToken} = useAuth()
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema as any),
    values: {
      groupName: "",
    },
  });

  async function handleGroupFormSubmit(data: GroupFormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/v1/group", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Group creation failed");
        return;
      }

      
    } catch {
      console.error("Something went wrong");
      setServerError("Something went wrong. Please try again");
    }
  }

  if(!user){
    return null
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleGroupFormSubmit)}>
        <Card>
          {serverError && <p className="container ml-6 font-semibold text-red-500">{serverError}</p>}
          <CardHeader>
            <CardTitle>Create Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="groupName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Group Name</FieldLabel>
                  <Input {...field} placeholder="Group name" aria-invalid={fieldState.invalid} />
                </Field>
              )}
            />
          </CardContent>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={
              "flex w-fit self-center bg-green-800/80 hover:cursor-pointer hover:bg-green-700/80"
            }
          >
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </Card>
      </form>
    </div>
  );
}
