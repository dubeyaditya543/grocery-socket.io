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
import { createGroupAction } from "@/lib/actions/group-action";

export function CreateGroupForm() {
  const { user, accessToken } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema as any),
    values: {
      groupName: "",
    },
  });

  async function handleGroupFormSubmit(data: GroupFormValues) {
    setServerError(null);
    
    const formData = new FormData()
    formData.append("groupName", data.groupName)

    const result = await createGroupAction(accessToken, {success: false}, formData)

    if(!result.success){
      setServerError(result.error ?? "Something went wrong")
      return;
    }

    form.reset()
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create Group</CardTitle>
        </CardHeader>
        <CardContent>
          {serverError && <p className="container font-semibold text-red-500">{serverError}</p>}
          <form onSubmit={form.handleSubmit(handleGroupFormSubmit)} className="space-y-4">
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
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className={
                "mx-auto flex w-fit self-center bg-green-800/80 hover:cursor-pointer hover:bg-green-700/80"
              }
            >
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
