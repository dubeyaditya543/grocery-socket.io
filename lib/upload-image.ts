import { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary";

export async function uploadImage(
  file: File,
  folder: string,
): Promise<{ url: string; publicId: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary result failed with no result"));
          return;
        }
        resolve(result);
      },
    );
    uploadStream.end(buffer)
  });

  return {
    url: result.secure_url,
    publicId: result.public_id
  }
}

export async function deleteImage(public_id: string): Promise<void>{
  if(!public_id){
    return
  }
  cloudinary.uploader.destroy(public_id, {resource_type: "image"})
}