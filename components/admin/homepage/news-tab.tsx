"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type NewsFormState = {
  title: string;
  buttonLabel: string;
  buttonHref: string;
};

type NewsTabProps = {
  news: NewsFormState;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: NewsFormState) => void;
  onSave: () => void;
};

export function NewsTab({ news, status, onChange, onSave }: NewsTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="news-title">Section title</Label>
        <Input
          id="news-title"
          value={news.title}
          onChange={(event) => onChange({ ...news, title: event.target.value })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="news-button-label">Button label</Label>
          <Input
            id="news-button-label"
            value={news.buttonLabel}
            onChange={(event) =>
              onChange({ ...news, buttonLabel: event.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="news-button-href">Button link</Label>
          <Input
            id="news-button-href"
            value={news.buttonHref}
            onChange={(event) =>
              onChange({ ...news, buttonHref: event.target.value })
            }
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save news"}
        </Button>
      </div>
    </div>
  );
}
