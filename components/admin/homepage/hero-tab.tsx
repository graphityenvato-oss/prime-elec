"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HeroFormState = {
  mainTitle: string;
  subtitle: string;
  description: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

type HeroTabProps = {
  hero: HeroFormState;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (key: keyof HeroFormState, value: string) => void;
  onSave: () => void;
};

export function HeroTab({ hero, status, onChange, onSave }: HeroTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="hero-title">Main title</Label>
        <Input
          id="hero-title"
          value={hero.mainTitle}
          onChange={(event) => onChange("mainTitle", event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="hero-subtitle">Subtitle</Label>
        <Input
          id="hero-subtitle"
          value={hero.subtitle}
          onChange={(event) => onChange("subtitle", event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="hero-description">Description</Label>
        <Textarea
          id="hero-description"
          value={hero.description}
          onChange={(event) => onChange("description", event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="hero-primary-label">Primary button label</Label>
          <Input
            id="hero-primary-label"
            value={hero.primaryButtonLabel}
            onChange={(event) =>
              onChange("primaryButtonLabel", event.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hero-primary-href">Primary button link</Label>
          <Input
            id="hero-primary-href"
            value={hero.primaryButtonHref}
            onChange={(event) =>
              onChange("primaryButtonHref", event.target.value)
            }
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="hero-secondary-label">Secondary button label</Label>
          <Input
            id="hero-secondary-label"
            value={hero.secondaryButtonLabel}
            onChange={(event) =>
              onChange("secondaryButtonLabel", event.target.value)
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="hero-secondary-href">Secondary button link</Label>
          <Input
            id="hero-secondary-href"
            value={hero.secondaryButtonHref}
            onChange={(event) =>
              onChange("secondaryButtonHref", event.target.value)
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
          {status === "saving" ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
