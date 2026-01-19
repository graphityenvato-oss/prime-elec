"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminSidebar } from "@/components/admin/sidebar";
import { PrimeCard } from "@/components/ui/prime-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type HeroFormState = {
  mainTitle: string;
  subtitle: string;
  description: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

const emptyHero: HeroFormState = {
  mainTitle: "",
  subtitle: "",
  description: "",
  primaryButtonLabel: "",
  primaryButtonHref: "",
  secondaryButtonLabel: "",
  secondaryButtonHref: "",
};

export default function AdminHomepagePage() {
  const [hero, setHero] = useState<HeroFormState>(emptyHero);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">(
    "loading"
  );

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/homepage/hero")
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;
        setHero({ ...emptyHero, ...data });
        setStatus("idle");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
        toast.error("Failed to load hero content.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateHero = (key: keyof HeroFormState, value: string) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setStatus("saving");
    const response = await fetch("/api/admin/homepage/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save hero content.");
      return;
    }

    setStatus("idle");
    toast.success("Saved.");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
        <AdminSidebar />

        <div className="space-y-6">
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Home Page
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Content manager
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Edit homepage sections and update the live content.
            </p>
          </section>

          <PrimeCard className="p-6">
            <Tabs defaultValue="hero">
              <TabsList>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="mission">Mission</TabsTrigger>
                <TabsTrigger value="stock">Featured Stock</TabsTrigger>
                <TabsTrigger value="subscription">Company Values</TabsTrigger>
                <TabsTrigger value="trusted">Trusted By</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="hero">
                <div className="mt-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hero-title">Main title</Label>
                    <Input
                      id="hero-title"
                      value={hero.mainTitle}
                      onChange={(event) =>
                        updateHero("mainTitle", event.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={hero.subtitle}
                      onChange={(event) =>
                        updateHero("subtitle", event.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hero-description">Description</Label>
                    <Textarea
                      id="hero-description"
                      value={hero.description}
                      onChange={(event) =>
                        updateHero("description", event.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="hero-primary-label">
                        Primary button label
                      </Label>
                      <Input
                        id="hero-primary-label"
                        value={hero.primaryButtonLabel}
                        onChange={(event) =>
                          updateHero("primaryButtonLabel", event.target.value)
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hero-primary-href">
                        Primary button link
                      </Label>
                      <Input
                        id="hero-primary-href"
                        value={hero.primaryButtonHref}
                        onChange={(event) =>
                          updateHero("primaryButtonHref", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="hero-secondary-label">
                        Secondary button label
                      </Label>
                      <Input
                        id="hero-secondary-label"
                        value={hero.secondaryButtonLabel}
                        onChange={(event) =>
                          updateHero(
                            "secondaryButtonLabel",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hero-secondary-href">
                        Secondary button link
                      </Label>
                      <Input
                        id="hero-secondary-href"
                        value={hero.secondaryButtonHref}
                        onChange={(event) =>
                          updateHero("secondaryButtonHref", event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      className="rounded-full bg-primary px-6"
                      onClick={handleSave}
                      disabled={status === "saving"}
                    >
                      {status === "saving" ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mission">
                <p className="mt-6 text-sm text-muted-foreground">
                  Mission &amp; Vision editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="stock">
                <p className="mt-6 text-sm text-muted-foreground">
                  Featured Stock editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="subscription">
                <p className="mt-6 text-sm text-muted-foreground">
                  Company Values editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="trusted">
                <p className="mt-6 text-sm text-muted-foreground">
                  Trusted By editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="steps">
                <p className="mt-6 text-sm text-muted-foreground">
                  Steps editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="testimonials">
                <p className="mt-6 text-sm text-muted-foreground">
                  Testimonials editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="news">
                <p className="mt-6 text-sm text-muted-foreground">
                  News editor will go here next.
                </p>
              </TabsContent>
            </Tabs>
          </PrimeCard>
        </div>
      </div>
    </main>
  );
}
