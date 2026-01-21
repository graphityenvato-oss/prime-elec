"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TrustedByFormState = {
  title: string;
};

type TrustedTabProps = {
  trustedBy: TrustedByFormState;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: TrustedByFormState) => void;
  onSave: () => void;
};

export function TrustedTab({
  trustedBy,
  status,
  onChange,
  onSave,
}: TrustedTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="trusted-title">Section title</Label>
        <Input
          id="trusted-title"
          value={trustedBy.title}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save title"}
        </Button>
      </div>
    </div>
  );
}
