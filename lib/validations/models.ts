import z from "zod";

export const groupSchema = z.object({
  groupName: z.string().min(1, "Group name is required").max(25, "Group name cannot exceed 25 chars"),
})

export const listSchema = z.object({
  listName: z.string().min(1, "List name is required").max(25, "List name cannot exceed 25 chars")
})

export const itemSchema = z.object({
  itemName: z.string().min(1, "Item name is required").max(25, "Item name cannot exceed 25 chars"),
  quantity: z.optional(z.number().min(1, "Quantity is required"))
})

export type GroupFormValues = z.infer<typeof groupSchema>
export type ListFormValues = z.infer<typeof listSchema>