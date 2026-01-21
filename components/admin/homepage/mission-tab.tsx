"use client";

import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { Textarea } from "@/components/ui/textarea";

type MissionCard = {
  title: string;
  description: string;
};

type MissionFormState = {
  title: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  cards: MissionCard[];
};

type MissionTabProps = {
  mission: MissionFormState;
  imagePreview: string | null;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: MissionFormState) => void;
  onCardChange: (index: number, value: Partial<MissionCard>) => void;
  onImageSelect: (file: File | null) => void;
  onImageRemove: () => void;
  onSave: () => void;
};

export function MissionTab({
  mission,
  imagePreview,
  status,
  onChange,
  onCardChange,
  onImageSelect,
  onImageRemove,
  onSave,
}: MissionTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="mission-title">Section title</Label>
        <Input
          id="mission-title"
          value={mission.title}
          onChange={(event) =>
            onChange({
              ...mission,
              title: event.target.value,
            })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mission-description">Section description</Label>
        <Textarea
          id="mission-description"
          value={mission.description}
          onChange={(event) =>
            onChange({
              ...mission,
              description: event.target.value,
            })
          }
        />
      </div>
      <div className="grid gap-2">
        <Label>Section image</Label>
        <ImageUploader
          value={imagePreview ?? mission.imageUrl}
          onFileChange={onImageSelect}
          onRemove={onImageRemove}
          maxSizeKb={200}
        />
      </div>
      <div className="grid gap-4">
        {mission.cards.map((card, index) => (
          <PrimeCard key={`mission-card-${index}`} className="p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`mission-card-title-${index}`}>
                  Card title {index + 1}
                </Label>
                <Input
                  id={`mission-card-title-${index}`}
                  value={card.title}
                  onChange={(event) =>
                    onCardChange(index, { title: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`mission-card-description-${index}`}>
                  Card description {index + 1}
                </Label>
                <Textarea
                  id={`mission-card-description-${index}`}
                  value={card.description}
                  onChange={(event) =>
                    onCardChange(index, { description: event.target.value })
                  }
                />
              </div>
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
          {status === "saving" ? "Saving..." : "Save mission"}
        </Button>
      </div>
    </div>
  );
}
