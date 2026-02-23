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
import { toast } from "sonner";

type FileUpload03Props = {
  className?: string;
};

export default function FileUpload03({ className }: FileUpload03Props) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [website, setWebsite] = React.useState("");
  const [formStartedAt, setFormStartedAt] = React.useState<number>(() =>
    Date.now(),
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        toast.error("File must be under 2MB.");
        return;
      }
      setFiles(acceptedFiles);
    },
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
                prevFiles.filter((prevFile) => prevFile.name !== file.name),
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
            <p className="text-pretty font-medium text-foreground">
              {file.name}
            </p>
            <p className="text-pretty mt-0.5 text-sm text-muted-foreground">
              {file.size} bytes
            </p>
          </div>
        </CardContent>
      </Card>
    </li>
  ));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toast.error("Name and phone number are required.");
      return;
    }
    if (!files.length) {
      toast.error("Please upload a BOQ file.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("fullName", fullName.trim());
      formData.append("phone", phone.trim());
      formData.append("projectName", projectName.trim());
      formData.append("notes", notes.trim());
      formData.append("website", website.trim());
      formData.append("startedAt", String(formStartedAt));

      const response = await fetch("/api/boq", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit request.");
      }

      toast.success("BOQ submitted.");
      setFiles([]);
      setFullName("");
      setPhone("");
      setProjectName("");
      setNotes("");
      setWebsite("");
      setFormStartedAt(Date.now());
      document
        .querySelector<HTMLButtonElement>('[data-dialog-close="boq"]')
        ?.click();
    } catch {
      toast.error("Could not submit BOQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("px-6 pb-6", className)}>
      <p className="text-sm text-muted-foreground">
        Upload your BOQ file and we will review it shortly.
      </p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
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
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
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
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
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
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
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
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
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
                "mt-2 flex justify-center rounded-md border border-dashed px-6 py-20 transition-colors duration-200",
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
              <span>Allowed: PDF, XLS, XLSX, CSV.</span>
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
            <Button type="button" variant="outline" data-dialog-close="boq">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
