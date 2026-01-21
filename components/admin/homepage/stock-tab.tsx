"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StockFormState = {
  eyebrow: string;
  title: string;
  description: string;
};

type StockTabProps = {
  stock: StockFormState;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: StockFormState) => void;
  onSave: () => void;
};

export function StockTab({ stock, status, onChange, onSave }: StockTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="stock-eyebrow">Eyebrow</Label>
        <Input
          id="stock-eyebrow"
          value={stock.eyebrow}
          onChange={(event) =>
            onChange({ ...stock, eyebrow: event.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stock-title">Title</Label>
        <Input
          id="stock-title"
          value={stock.title}
          onChange={(event) =>
            onChange({ ...stock, title: event.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stock-description">Description</Label>
        <Textarea
          id="stock-description"
          value={stock.description}
          onChange={(event) =>
            onChange({ ...stock, description: event.target.value })
          }
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save Featured Stock"}
        </Button>
      </div>
    </div>
  );
}
