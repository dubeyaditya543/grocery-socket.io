import z from "zod";

const envScheam = z.object({
  NODE_ENV: z.enum(["production", "development", "testing"]).default("development"),
  PORT: z.coerce.number().default(4000),
  MONGODB_URI: z.string().min(1, "Mongodb uri is required"),
  JWT_ACCESS_SECRET: z.string().min(32, "Jwt access secret must be at least 32 chars"),
  JWT_REFRESH_SECRET: z.string().min(32, "Jwt refresh secret must be at least 32 chars"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "Cloudinary cloud name is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "Cloudinary api key is required"),
  CLOUDINARY_SECRET_KEY: z.string().min(1, "Cloudinary api secret is required")
})

const parsed = envScheam.safeParse(process.env)

if(!parsed.success){
  console.error("Failed to verify env schema. Make sure all values are correct and present")
  throw new Error("Invalid env variables")
}

export const env = parsed.data