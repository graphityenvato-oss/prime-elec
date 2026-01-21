"use client";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { Textarea } from "@/components/ui/textarea";

type StepItem = {
  title: string;
  description: string;
  imageUrl: string;
  imagePath: string;
};

type StepsFormState = {
  title: string;
  steps: StepItem[];
};

type StepsTabProps = {
  steps: StepsFormState;
  imagePreviews: (string | null)[];
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: StepsFormState) => void;
  onStepChange: (index: number, value: Partial<StepItem>) => void;
  onImageSelect: (index: number, file: File | null) => void;
  onImageRemove: (index: number) => void;
  onSave: () => void;
};

export function StepsTab({
  steps,
  imagePreviews,
  status,
  onChange,
  onStepChange,
  onImageSelect,
  onImageRemove,
  onSave,
}: StepsTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="steps-title">Section title</Label>
        <Input
          id="steps-title"
          value={steps.title}
          onChange={(event) =>
            onChange({ ...steps, title: event.target.value })
          }
        />
      </div>
      <div className="grid gap-4">
        {steps.steps.map((step, index) => (
          <PrimeCard key={`step-${index}`} className="grid gap-4 p-4">
            <div className="grid gap-2">
              <Label htmlFor={`step-title-${index}`}>
                Step {index + 1} title
              </Label>
              <Input
                id={`step-title-${index}`}
                value={step.title}
                onChange={(event) =>
                  onStepChange(index, { title: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`step-description-${index}`}>
                Step {index + 1} description
              </Label>
              <Textarea
                id={`step-description-${index}`}
                value={step.description}
                onChange={(event) =>
                  onStepChange(index, { description: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Step {index + 1} image</Label>
              <ImageUploader
                value={imagePreviews[index] ?? step.imageUrl}
                onFileChange={(file) => onImageSelect(index, file)}
                onRemove={() => onImageRemove(index)}
                maxSizeKb={200}
              />
            </div>
          </PrimeCard>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="rounded-full bg-primary px-6"
          onClick={onSave}
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : "Save Steps"}
        </Button>
      </div>
    </div>
  );
}
