import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { PrimeCard } from "@/components/ui/prime-card";

const posts = [
  {
    date: "AUG 23, 2023",
    title:
      "EVCS Raises $68.8 Million to Accelerate Expansion of West Coast EV Fast Charging Network",
    excerpt:
      "EVCS is thrilled to announce reaching a major milestone in its collaboration with Hertz: two million miles of EV charging.",
  },
  {
    date: "MAR 19, 2024",
    title:
      "EVCS Secures $100 Million in Public Funding to Add DC Fast Chargers on the West Coast",
    excerpt:
      "EVCS is thrilled to announce reaching a major milestone in its collaboration with Hertz: two million miles of EV charging.",
  },
  {
    date: "JUL 6, 2023",
    title:
      "EVCS Raises $68.8 Million to Accelerate Expansion of West Coast EV Fast Charging Network",
    excerpt:
      "EVCS is thrilled to announce reaching a major milestone in its collaboration with Hertz: two million miles of EV charging.",
  },
];

export function EvcsNews() {
  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 text-foreground shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Prime Blogs
          </h2>
        </Reveal>
        <Button className="w-fit rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          All Blog Posts
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={`${post.title}-${index}`} delay={index * 0.08}>
            <PrimeCard className="rounded-3xl p-4">
              <div className="h-48 rounded-2xl border border-border/60 bg-muted/30" />
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                {post.date}
              </p>
              <h3 className="mt-2 text-lg font-semibold leading-snug">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-full px-4 text-xs"
              >
                Read More
              </Button>
            </PrimeCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
