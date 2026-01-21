"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type ImageUploaderProps = {
  value?: string;
  onFileChange: (file: File | null) => void;
  onRemove?: () => void;
  maxSizeKb?: number;
};

export function ImageUploader({
  value,
  onFileChange,
  onRemove,
  maxSizeKb = 200,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasLocalFile, setHasLocalFile] = useState(false);
  const maxBytes = maxSizeKb * 1024;

  const displayUrl = hasLocalFile ? previewUrl : (value ?? null);

  useEffect(() => {
    return () => {
      if (previewUrl && hasLocalFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, hasLocalFile]);

  const handleFileSelect = (file: File) => {
    if (file.size > maxBytes) {
      toast.error(`Image must be under ${maxSizeKb} KB.`);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setHasLocalFile(true);
    onFileChange(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    if (previewUrl && hasLocalFile) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setHasLocalFile(false);
    onFileChange(null);
    onRemove?.();
  };

  return (
    <div className="grid gap-3">
      <div
        className="group relative flex min-h-45 w-full items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        {displayUrl ? (
          <>
            <Image
              src={displayUrl}
              alt="Uploaded preview"
              fill
              className="rounded-2xl object-cover"
            />
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-muted-foreground shadow-sm transition hover:text-foreground"
              onClick={handleRemove}
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border/60 bg-background/80 p-3">
              <UploadCloud className="size-5" />
            </div>
            <div className="text-foreground">Drag an image</div>
            <div className="text-xs">
              Select an image or drag here to upload directly
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2 rounded-full px-4 text-xs"
              onClick={() => inputRef.current?.click()}
            >
              Browse
            </Button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Max size {maxSizeKb} KB. JPG, PNG, or WEBP.
      </div>
    </div>
  );
}
