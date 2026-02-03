"use client";

import { File, Trash } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type FileUpload03Props = {
  className?: string;
};

export default function FileUpload03({ className }: FileUpload03Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const filesList = files.map((file) => (
    <li key={file.name} className="relative">
      <Card className="relative p-4">
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove file"
            onClick={() =>
              setFiles((prevFiles) =>
                prevFiles.filter((prevFile) => prevFile.name !== file.name)
              )
            }
          >
            <Trash className="h-5 w-5" aria-hidden={true} />
          </Button>
        </div>
        <CardContent className="flex items-center space-x-3 p-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <File className="h-5 w-5 text-foreground" aria-hidden={true} />
          </span>
          <div>
            <p className="text-pretty font-medium text-foreground">{file.name}</p>
            <p className="text-pretty mt-0.5 text-sm text-muted-foreground">
              {file.size} bytes
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  return (
    <div className={cn("px-6 pb-6", className)}>
      <p className="text-sm text-muted-foreground">
        Upload your BOQ file and we will review it shortly.
      </p>
      <form action="#" method="post" className="mt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="contact-name" className="font-medium">
              Name
            </Label>
            <Input
              type="text"
              id="contact-name"
              name="contact-name"
              placeholder="Full name"
              className="mt-2"
            />
          </div>
          <div className="col-span-full sm:col-span-3">
            <Label htmlFor="contact-phone" className="font-medium">
              Phone Number
            </Label>
            <Input
              type="tel"
              id="contact-phone"
              name="contact-phone"
              placeholder="+961 70 000 000"
              className="mt-2"
            />
          </div>
          <div className="col-span-full">
            <Label htmlFor="project-name" className="font-medium">
              Project Name (optional)
            </Label>
            <Input
              type="text"
              id="project-name"
              name="project-name"
              placeholder="Project name"
              className="mt-2"
            />
          </div>
          <div className="col-span-full">
            <Label htmlFor="project-notes" className="font-medium">
              Notes (optional)
            </Label>
            <Textarea
              id="project-notes"
              name="project-notes"
              placeholder="Short notes"
              className="mt-2"
              rows={3}
            />
          </div>
          <div className="col-span-full">
            <Label htmlFor="file-upload-2" className="font-medium">
              File(s) upload
            </Label>
            <div
              {...getRootProps()}
              className={cn(
                isDragActive
                  ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                  : "border-border",
                "mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200"
              )}
            >
              <div>
                <File
                  className="mx-auto h-12 w-12 text-muted-foreground/80"
                  aria-hidden={true}
                />
                <div className="mt-4 flex flex-col items-center gap-1 text-center text-muted-foreground sm:flex-row sm:text-left">
                  <p>Drag and drop or</p>
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer rounded-sm font-medium text-primary hover:text-primary/80 hover:underline hover:underline-offset-4 sm:pl-1"
                  >
                    <span>choose file(s)</span>
                    <input
                      {...getInputProps()}
                      id="file-upload-2"
                      name="file-upload-2"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="text-pretty pl-1">to upload</p>
                </div>
              </div>
            </div>
            <p className="text-pretty mt-2 text-sm leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
              <span>All file types are allowed to upload.</span>
              <span className="pl-1 sm:pl-0">Max. size per file: 2MB</span>
            </p>
            {filesList.length > 0 && (
              <>
                <h4 className="text-balance mt-6 font-medium text-foreground">
                  File(s) to upload
                </h4>
                <ul role="list" className="mt-4 space-y-4">
                  {filesList}
                </ul>
              </>
            )}
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex items-center justify-end space-x-3">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}
