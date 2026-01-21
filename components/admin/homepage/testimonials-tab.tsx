"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { Textarea } from "@/components/ui/textarea";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

type TestimonialsFormState = {
  title: string;
  items: TestimonialItem[];
};

type TestimonialsTabProps = {
  testimonials: TestimonialsFormState;
  status: "idle" | "loading" | "saving" | "error";
  onChange: (value: TestimonialsFormState) => void;
  onItemChange: (index: number, value: Partial<TestimonialItem>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onSave: () => void;
};

export function TestimonialsTab({
  testimonials,
  status,
  onChange,
  onItemChange,
  onAdd,
  onRemove,
  onSave,
}: TestimonialsTabProps) {
  return (
    <div className="mt-6 grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="testimonials-title">Section title</Label>
        <Input
          id="testimonials-title"
          value={testimonials.title}
          onChange={(event) =>
            onChange({ ...testimonials, title: event.target.value })
          }
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="rounded-full" onClick={onAdd}>
          <Plus className="mr-2 size-4" />
          Add testimonial
        </Button>
        <span className="text-xs text-muted-foreground">
          Max 10 testimonials.
        </span>
      </div>
      <div className="grid gap-4">
        {testimonials.items.map((item, index) => (
          <PrimeCard key={`testimonial-${index}`} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="grid flex-1 gap-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor={`testimonial-name-${index}`}>Name</Label>
                    <Input
                      id={`testimonial-name-${index}`}
                      value={item.name}
                      onChange={(event) =>
                        onItemChange(index, { name: event.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`testimonial-role-${index}`}>Role</Label>
                    <Input
                      id={`testimonial-role-${index}`}
                      value={item.role}
                      onChange={(event) =>
                        onItemChange(index, { role: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2 sm:max-w-xs">
                  <Label htmlFor={`testimonial-rating-${index}`}>
                    Rating (1-5)
                  </Label>
                  <Input
                    id={`testimonial-rating-${index}`}
                    type="number"
                    min={1}
                    max={5}
                    value={item.rating}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      onItemChange(index, {
                        rating: Number.isNaN(value)
                          ? 5
                          : Math.min(5, Math.max(1, value)),
                      });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`testimonial-quote-${index}`}>Quote</Label>
                  <Textarea
                    id={`testimonial-quote-${index}`}
                    value={item.quote}
                    onChange={(event) =>
                      onItemChange(index, { quote: event.target.value })
                    }
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                onClick={() => onRemove(index)}
                aria-label="Remove testimonial"
              >
                <Trash2 className="size-4" />
              </Button>
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
          {status === "saving" ? "Saving..." : "Save testimonials"}
        </Button>
      </div>
    </div>
  );
}
