"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrimeCard } from "@/components/ui/prime-card";
import { HeroTab } from "@/components/admin/homepage/hero-tab";
import { MissionTab } from "@/components/admin/homepage/mission-tab";
import { NewsTab } from "@/components/admin/homepage/news-tab";
import { StatsTab } from "@/components/admin/homepage/stats-tab";
import { StockTab } from "@/components/admin/homepage/stock-tab";
import { StepsTab } from "@/components/admin/homepage/steps-tab";
import { TestimonialsTab } from "@/components/admin/homepage/testimonials-tab";
import { TrustedTab } from "@/components/admin/homepage/trusted-tab";
import { ValuesTab } from "@/components/admin/homepage/values-tab";

type HeroFormState = {
  mainTitle: string;
  subtitle: string;
  description: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
};

type StatFormItem = {
  title: string;
  value: number;
  suffix: string;
};

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

type StockFormState = {
  eyebrow: string;
  title: string;
  description: string;
};

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

type TrustedByFormState = {
  title: string;
};

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

type NewsFormState = {
  title: string;
  buttonLabel: string;
  buttonHref: string;
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

const emptyMission: MissionFormState = {
  title: "",
  description: "",
  imageUrl: "",
  imagePath: "",
  cards: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
};

const emptyStats: StatFormItem[] = [
  { title: "", value: 0, suffix: "+" },
  { title: "", value: 0, suffix: "+" },
  { title: "", value: 0, suffix: "+" },
  { title: "", value: 0, suffix: "+" },
];

const emptyStock: StockFormState = {
  eyebrow: "",
  title: "",
  description: "",
};

const emptyValues: ValuesFormState = {
  eyebrow: "",
  title: "",
  description: "",
  benefits: ["", "", "", "", ""],
  buttonLabel: "",
  buttonHref: "",
  imageUrl: "",
  imagePath: "",
  highlightTitle: "",
  highlightDescription: "",
  highlightButtonLabel: "",
  highlightButtonHref: "",
};

const emptySteps: StepsFormState = {
  title: "",
  steps: [
    { title: "", description: "", imageUrl: "", imagePath: "" },
    { title: "", description: "", imageUrl: "", imagePath: "" },
    { title: "", description: "", imageUrl: "", imagePath: "" },
  ],
};

const emptyTrustedBy: TrustedByFormState = {
  title: "",
};

const emptyTestimonials: TestimonialsFormState = {
  title: "",
  items: [],
};

const emptyNews: NewsFormState = {
  title: "",
  buttonLabel: "",
  buttonHref: "",
};

export default function AdminHomepagePage() {
  const [hero, setHero] = useState<HeroFormState>(emptyHero);
  const [mission, setMission] = useState<MissionFormState>(emptyMission);
  const [stats, setStats] = useState<StatFormItem[]>(emptyStats);
  const [stock, setStock] = useState<StockFormState>(emptyStock);
  const [values, setValues] = useState<ValuesFormState>(emptyValues);
  const [steps, setSteps] = useState<StepsFormState>(emptySteps);
  const [trustedBy, setTrustedBy] =
    useState<TrustedByFormState>(emptyTrustedBy);
  const [testimonials, setTestimonials] =
    useState<TestimonialsFormState>(emptyTestimonials);
  const [news, setNews] = useState<NewsFormState>(emptyNews);
  const [valuesImageFile, setValuesImageFile] = useState<File | null>(null);
  const [valuesImagePreview, setValuesImagePreview] = useState<string | null>(
    null,
  );
  const [missionImageFile, setMissionImageFile] = useState<File | null>(null);
  const [missionImagePreview, setMissionImagePreview] = useState<string | null>(
    null,
  );
  const [stepImageFiles, setStepImageFiles] = useState<(File | null)[]>(
    Array.from({ length: 3 }, () => null),
  );
  const [stepImagePreviews, setStepImagePreviews] = useState<(string | null)[]>(
    Array.from({ length: 3 }, () => null),
  );
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">(
    "loading",
  );

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch("/api/admin/homepage/hero").then((response) => response.json()),
      fetch("/api/admin/homepage/stats").then((response) => response.json()),
      fetch("/api/admin/homepage/mission").then((response) => response.json()),
      fetch("/api/admin/homepage/featured-stock").then((response) =>
        response.json(),
      ),
      fetch("/api/admin/homepage/company-values").then((response) =>
        response.json(),
      ),
      fetch("/api/admin/homepage/steps").then((response) => response.json()),
      fetch("/api/admin/homepage/testimonials").then((response) =>
        response.json(),
      ),
      fetch("/api/admin/homepage/news").then((response) => response.json()),
      fetch("/api/admin/homepage/trusted-by").then((response) =>
        response.json(),
      ),
    ])
      .then(
        ([
          heroData,
          statsData,
          missionData,
          stockData,
          valuesData,
          stepsData,
          testimonialsData,
          newsData,
          trustedByData,
        ]) => {
          if (!isMounted) return;
          setHero({ ...emptyHero, ...heroData });
          if (statsData?.items?.length) {
            setStats(
              statsData.items.map((item: StatFormItem) => ({
                title: item.title,
                value: item.value,
                suffix: item.suffix ?? "",
              })),
            );
          } else {
            setStats(emptyStats);
          }
          setMission({ ...emptyMission, ...missionData });
          setStock({ ...emptyStock, ...stockData });
          setValues({ ...emptyValues, ...valuesData });
          setSteps({ ...emptySteps, ...stepsData });
          setTestimonials({ ...emptyTestimonials, ...testimonialsData });
          setNews({ ...emptyNews, ...newsData });
          setTrustedBy({ ...emptyTrustedBy, ...trustedByData });
          setMissionImageFile(null);
          setMissionImagePreview(null);
          setValuesImageFile(null);
          setValuesImagePreview(null);
          setStepImageFiles(Array.from({ length: 3 }, () => null));
          setStepImagePreviews(Array.from({ length: 3 }, () => null));
          setStatus("idle");
        },
      )
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
        toast.error("Failed to load homepage content.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateHero = (key: keyof HeroFormState, value: string) => {
    setHero((prev) => ({ ...prev, [key]: value }));
  };

  const updateStat = (index: number, value: Partial<StatFormItem>) => {
    setStats((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...value } : item)),
    );
  };

  const updateMission = (value: MissionFormState) => {
    setMission(value);
  };

  const updateMissionCard = (index: number, value: Partial<MissionCard>) => {
    setMission((prev) => ({
      ...prev,
      cards: prev.cards.map((item, idx) =>
        idx === index ? { ...item, ...value } : item,
      ),
    }));
  };

  const handleMissionImageSelect = (file: File | null) => {
    if (!file) {
      setMissionImageFile(null);
      setMissionImagePreview(null);
      return;
    }
    if (missionImagePreview) {
      URL.revokeObjectURL(missionImagePreview);
    }
    const objectUrl = URL.createObjectURL(file);
    setMissionImagePreview(objectUrl);
    setMissionImageFile(file);
  };

  const updateStock = (value: StockFormState) => {
    setStock(value);
  };

  const updateValues = (value: ValuesFormState) => {
    setValues(value);
  };

  const updateValuesBenefit = (index: number, value: string) => {
    setValues((prev) => ({
      ...prev,
      benefits: prev.benefits.map((item, idx) =>
        idx === index ? value : item,
      ),
    }));
  };

  const handleValuesImageSelect = (file: File | null) => {
    if (!file) {
      setValuesImageFile(null);
      setValuesImagePreview(null);
      return;
    }
    if (valuesImagePreview) {
      URL.revokeObjectURL(valuesImagePreview);
    }
    const objectUrl = URL.createObjectURL(file);
    setValuesImagePreview(objectUrl);
    setValuesImageFile(file);
  };

  const updateSteps = (value: StepsFormState) => {
    setSteps(value);
  };

  const updateStep = (index: number, value: Partial<StepItem>) => {
    setSteps((prev) => ({
      ...prev,
      steps: prev.steps.map((item, idx) =>
        idx === index ? { ...item, ...value } : item,
      ),
    }));
  };

  const handleStepImageSelect = (index: number, file: File | null) => {
    setStepImagePreviews((prev) => {
      const next = [...prev];
      if (next[index]) {
        URL.revokeObjectURL(next[index] as string);
      }
      next[index] = file ? URL.createObjectURL(file) : null;
      return next;
    });
    setStepImageFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const handleStepImageRemove = async (index: number) => {
    const currentPath = steps.steps[index]?.imagePath;
    if (currentPath) {
      const response = await fetch("/api/uploads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: currentPath }),
      });

      if (!response.ok) {
        toast.error("Failed to delete image.");
        return;
      }
    }

    setStepImagePreviews((prev) => {
      const next = [...prev];
      if (next[index]) {
        URL.revokeObjectURL(next[index] as string);
      }
      next[index] = null;
      return next;
    });
    setStepImageFiles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setSteps((prev) => ({
      ...prev,
      steps: prev.steps.map((item, idx) =>
        idx === index ? { ...item, imageUrl: "", imagePath: "" } : item,
      ),
    }));
    toast.success("Image removed.");
  };

  const updateTrustedBy = (value: TrustedByFormState) => {
    setTrustedBy(value);
  };

  const updateTestimonials = (value: TestimonialsFormState) => {
    setTestimonials(value);
  };

  const updateNews = (value: NewsFormState) => {
    setNews(value);
  };

  const updateTestimonialItem = (
    index: number,
    value: Partial<TestimonialItem>,
  ) => {
    setTestimonials((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index ? { ...item, ...value } : item,
      ),
    }));
  };

  const handleAddTestimonial = () => {
    setTestimonials((prev) => {
      if (prev.items.length >= 10) return prev;
      return {
        ...prev,
        items: [...prev.items, { name: "", role: "", quote: "", rating: 5 }],
      };
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
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

  const handleStatsSave = async () => {
    setStatus("saving");
    const response = await fetch("/api/admin/homepage/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: stats }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save stats.");
      return;
    }

    setStatus("idle");
    toast.success("Stats saved.");
  };

  const handleMissionSave = async () => {
    setStatus("saving");
    let imageUrl = mission.imageUrl;
    let imagePath = mission.imagePath;

    if (missionImageFile) {
      const formData = new FormData();
      formData.append("file", missionImageFile);

      const uploadResponse = await fetch("/api/uploads?folder=Prime/mission", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        setStatus("error");
        toast.error("Failed to upload image.");
        return;
      }

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadData?.publicUrl || !uploadData?.path) {
        setStatus("error");
        toast.error("Failed to upload image.");
        return;
      }

      imageUrl = uploadData.publicUrl;
      imagePath = uploadData.path;
    }

    const response = await fetch("/api/admin/homepage/mission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...mission,
        imageUrl,
        imagePath,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save mission content.");
      return;
    }

    if (missionImagePreview) {
      URL.revokeObjectURL(missionImagePreview);
    }
    setMission((prev) => ({
      ...prev,
      imageUrl,
      imagePath,
    }));
    setMissionImageFile(null);
    setMissionImagePreview(null);
    setStatus("idle");
    toast.success("Mission saved.");
  };

  const handleMissionImageRemove = async () => {
    if (mission.imagePath) {
      const response = await fetch("/api/uploads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: mission.imagePath }),
      });

      if (!response.ok) {
        toast.error("Failed to delete image.");
        return;
      }
    }

    if (missionImagePreview) {
      URL.revokeObjectURL(missionImagePreview);
    }
    setMission((prev) => ({ ...prev, imageUrl: "", imagePath: "" }));
    setMissionImageFile(null);
    setMissionImagePreview(null);
    toast.success("Image removed.");
  };

  const handleStockSave = async () => {
    setStatus("saving");
    const response = await fetch("/api/admin/homepage/featured-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stock),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save featured stock content.");
      return;
    }

    setStatus("idle");
    toast.success("Featured stock saved.");
  };

  const handleValuesSave = async () => {
    setStatus("saving");
    let imageUrl = values.imageUrl;
    let imagePath = values.imagePath;

    if (valuesImageFile) {
      const formData = new FormData();
      formData.append("file", valuesImageFile);

      const uploadResponse = await fetch("/api/uploads?folder=Prime/values", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        setStatus("error");
        toast.error("Failed to upload image.");
        return;
      }

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadData?.publicUrl || !uploadData?.path) {
        setStatus("error");
        toast.error("Failed to upload image.");
        return;
      }

      imageUrl = uploadData.publicUrl;
      imagePath = uploadData.path;
    }

    const response = await fetch("/api/admin/homepage/company-values", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        imageUrl,
        imagePath,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save company values.");
      return;
    }

    if (valuesImagePreview) {
      URL.revokeObjectURL(valuesImagePreview);
    }
    setValues((prev) => ({ ...prev, imageUrl, imagePath }));
    setValuesImageFile(null);
    setValuesImagePreview(null);
    setStatus("idle");
    toast.success("Company values saved.");
  };

  const handleStepsSave = async () => {
    setStatus("saving");
    let nextSteps = [...steps.steps];

    for (let index = 0; index < stepImageFiles.length; index += 1) {
      const file = stepImageFiles[index];
      if (!file) continue;

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(
        `/api/uploads?folder=Prime/steps/step-${index + 1}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        setStatus("error");
        toast.error("Failed to upload image.");
        return;
      }

      const uploadData = await uploadResponse.json().catch(() => ({}));
      if (!uploadData?.publicUrl || !uploadData?.path) {
        setStatus("error");
        toast.error("Failed to upload image.");
        return;
      }

      nextSteps = nextSteps.map((item, idx) =>
        idx === index
          ? {
              ...item,
              imageUrl: uploadData.publicUrl,
              imagePath: uploadData.path,
            }
          : item,
      );
    }

    const response = await fetch("/api/admin/homepage/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...steps, steps: nextSteps }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save steps.");
      return;
    }

    stepImagePreviews.forEach((preview) => {
      if (preview) URL.revokeObjectURL(preview);
    });
    setSteps((prev) => ({ ...prev, steps: nextSteps }));
    setStepImageFiles(Array.from({ length: 3 }, () => null));
    setStepImagePreviews(Array.from({ length: 3 }, () => null));
    setStatus("idle");
    toast.success("Steps saved.");
  };

  const handleTestimonialsSave = async () => {
    setStatus("saving");
    const response = await fetch("/api/admin/homepage/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testimonials),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save testimonials.");
      return;
    }

    setStatus("idle");
    toast.success("Testimonials saved.");
  };

  const handleNewsSave = async () => {
    setStatus("saving");
    const response = await fetch("/api/admin/homepage/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(news),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save news content.");
      return;
    }

    setStatus("idle");
    toast.success("News saved.");
  };

  const handleTrustedBySave = async () => {
    setStatus("saving");
    const response = await fetch("/api/admin/homepage/trusted-by", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trustedBy),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setStatus("error");
      toast.error(data?.message || "Failed to save trusted by title.");
      return;
    }

    setStatus("idle");
    toast.success("Trusted by saved.");
  };

  const handleValuesImageRemove = async () => {
    if (values.imagePath) {
      const response = await fetch("/api/uploads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: values.imagePath }),
      });

      if (!response.ok) {
        toast.error("Failed to delete image.");
        return;
      }
    }

    if (valuesImagePreview) {
      URL.revokeObjectURL(valuesImagePreview);
    }
    setValues((prev) => ({ ...prev, imageUrl: "", imagePath: "" }));
    setValuesImageFile(null);
    setValuesImagePreview(null);
    toast.success("Image removed.");
  };

  return (
    <>
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
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="stock">Featured Stock</TabsTrigger>
            <TabsTrigger value="subscription">Company Values</TabsTrigger>
            <TabsTrigger value="trusted">Trusted By</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="hero">
            <HeroTab
              hero={hero}
              status={status}
              onChange={updateHero}
              onSave={handleSave}
            />
          </TabsContent>
          <TabsContent value="stats">
            <StatsTab
              stats={stats}
              status={status}
              onChange={updateStat}
              onSave={handleStatsSave}
            />
          </TabsContent>

          <TabsContent value="mission">
            <MissionTab
              mission={mission}
              imagePreview={missionImagePreview}
              status={status}
              onChange={updateMission}
              onCardChange={updateMissionCard}
              onImageSelect={handleMissionImageSelect}
              onImageRemove={handleMissionImageRemove}
              onSave={handleMissionSave}
            />
          </TabsContent>
          <TabsContent value="stock">
            <StockTab
              stock={stock}
              status={status}
              onChange={updateStock}
              onSave={handleStockSave}
            />
          </TabsContent>
          <TabsContent value="subscription">
            <ValuesTab
              values={values}
              imagePreview={valuesImagePreview}
              status={status}
              onChange={updateValues}
              onBenefitChange={updateValuesBenefit}
              onImageSelect={handleValuesImageSelect}
              onImageRemove={handleValuesImageRemove}
              onSave={handleValuesSave}
            />
          </TabsContent>
          <TabsContent value="trusted">
            <TrustedTab
              trustedBy={trustedBy}
              status={status}
              onChange={updateTrustedBy}
              onSave={handleTrustedBySave}
            />
          </TabsContent>
          <TabsContent value="steps">
            <StepsTab
              steps={steps}
              imagePreviews={stepImagePreviews}
              status={status}
              onChange={updateSteps}
              onStepChange={updateStep}
              onImageSelect={handleStepImageSelect}
              onImageRemove={handleStepImageRemove}
              onSave={handleStepsSave}
            />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsTab
              testimonials={testimonials}
              status={status}
              onChange={updateTestimonials}
              onItemChange={updateTestimonialItem}
              onAdd={handleAddTestimonial}
              onRemove={handleRemoveTestimonial}
              onSave={handleTestimonialsSave}
            />
          </TabsContent>
          <TabsContent value="news">
            <NewsTab
              news={news}
              status={status}
              onChange={updateNews}
              onSave={handleNewsSave}
            />
          </TabsContent>
        </Tabs>
      </PrimeCard>
    </>
  );
}
