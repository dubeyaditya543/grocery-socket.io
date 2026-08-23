import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required").regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 chars long").max(64, "Password can be at max 64 chars long")
})

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, 'Password is required')
})

export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>