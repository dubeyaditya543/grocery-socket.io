"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import { AvatarPic } from "./AvatarPic";
import { uploadImageAction } from "@/lib/actions/user-action";
import { useAuth } from "@/contexts/AuthContext";

interface UploadImageFormProps {
  fullName: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
}

export function UploadImageForm({
  fullName,
  avatarUrl,
}: UploadImageFormProps) {
  const { accessToken } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      return;
    }
    setImageFile(file);
  }

  function clearImage() {
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
  }

  async function handleImageUpload() {
    if (!imageFile) {
      return;
    }
    const formData = new FormData();
    formData.append("image", imageFile);

    const uploadedImageResult = await uploadImageAction(accessToken, { success: false }, formData);

    if (!uploadedImageResult.success) {
      throw new Error(uploadedImageResult.error ?? "Something went wrong while uplaoding image");
    }

    clearImage();
    setIsDialogOpen?.(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex cursor-pointer rounded-full transition outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-emerald-500"
            title="Upload profile picture"
          >
            <AvatarPic fullName={fullName} avatarUrl={avatarUrl} />
          </button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleImageUpload();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <Label htmlFor="profile_pic">Profile Pic</Label>
              <Input
                key={fileInputKey}
                id="profile_pic"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              className={"cursor-pointer bg-green-700 text-white hover:bg-green-800"}
            >
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
