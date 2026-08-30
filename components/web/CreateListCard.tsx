"use client";

import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ListFormValues, listSchema } from "@/lib/validations/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createListAction } from "@/lib/actions/list-action";

interface CreateListProps {
  groupId: string;
}

export function CreateListCard({ groupId }: CreateListProps) {
  const { user, accessToken } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ListFormValues>({
    resolver: zodResolver(listSchema as any),
    values: {
      listName: "",
    },
  });

  async function handleCreateListFormSubmit(data: ListFormValues) {
    setServerError(null);
    try {
      const formData = new FormData();
      formData.append("listName", data.listName);

      const res = await createListAction(accessToken, groupId, { success: false }, formData);

      if (!res.success) {
        setServerError(res.error ?? "Something went wrong");
        return;
      }

      form.reset()
    } catch {
      setServerError("Something went wrong. Please try again");
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create List</CardTitle>
        </CardHeader>
        <CardContent>
          {serverError && <p className="container font-semibold text-red-500">{serverError}</p>}
          <form onSubmit={form.handleSubmit(handleCreateListFormSubmit)} className="space-y-4">
            <Controller
              name="listName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>List name</FieldLabel>
                  <Input {...field} aria-invalid={fieldState.invalid} placeholder="List name" />
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
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
