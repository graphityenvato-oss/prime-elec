"use client";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { Textarea } from "@/components/ui/textarea";

type ValuesFormState = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  imagePath: string;
  highlightTitle: string;
  highlightDescription: string;
  highlightButtonLabel: string;
  highlightButtonHref: string;
};

type ValuesTabProps = {
  values: ValuesFormState;
  imagePreview: string | null;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: ValuesFormState) => void;
  onBenefitChange: (index: number, value: string) => void;
  onImageSelect: (file: File | null) => void;
  onImageRemove: () => void;
  onSave: () => void;
};

export function ValuesTab({
  values,
  imagePreview,
  status,
  onChange,
  onBenefitChange,
  onImageSelect,
  onImageRemove,
  onSave,
}: ValuesTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="values-eyebrow">Eyebrow</Label>
        <Input
          id="values-eyebrow"
          value={values.eyebrow}
          onChange={(event) =>
            onChange({ ...values, eyebrow: event.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="values-title">Title</Label>
        <Input
          id="values-title"
          value={values.title}
          onChange={(event) =>
            onChange({ ...values, title: event.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="values-description">Description</Label>
        <Textarea
          id="values-description"
          value={values.description}
          onChange={(event) =>
            onChange({ ...values, description: event.target.value })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label>Section image</Label>
        <ImageUploader
          value={imagePreview ?? values.imageUrl}
          onFileChange={onImageSelect}
          onRemove={onImageRemove}
          maxSizeKb={200}
        />
      </div>
      <PrimeCard className="grid gap-3 p-4">
        <Label>Benefits (5)</Label>
        {values.benefits.map((benefit, index) => (
          <Input
            key={`benefit-${index}`}
            value={benefit}
            placeholder={`Benefit ${index + 1}`}
            onChange={(event) => onBenefitChange(index, event.target.value)}
          />
        ))}
      </PrimeCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="values-button-label">Button label</Label>
          <Input
            id="values-button-label"
            value={values.buttonLabel}
            onChange={(event) =>
              onChange({ ...values, buttonLabel: event.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="values-button-href">Button link</Label>
          <Input
            id="values-button-href"
            value={values.buttonHref}
            onChange={(event) =>
              onChange({ ...values, buttonHref: event.target.value })
            }
          />
        </div>
      </div>
      <PrimeCard className="grid gap-3 p-4">
        <Label>Highlight card</Label>
        <Input
          placeholder="Highlight title"
          value={values.highlightTitle}
          onChange={(event) =>
            onChange({ ...values, highlightTitle: event.target.value })
          }
        />
        <Textarea
          placeholder="Highlight description"
          value={values.highlightDescription}
          onChange={(event) =>
            onChange({ ...values, highlightDescription: event.target.value })
          }
        />
        <Input
          placeholder="Highlight button label"
          value={values.highlightButtonLabel}
          onChange={(event) =>
            onChange({ ...values, highlightButtonLabel: event.target.value })
          }
        />
        <Input
          placeholder="Highlight button link"
          value={values.highlightButtonHref}
          onChange={(event) =>
            onChange({ ...values, highlightButtonHref: event.target.value })
          }
        />
      </PrimeCard>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save Company Values"}
        </Button>
      </div>
    </div>
  );
}
