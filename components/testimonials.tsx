import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { PrimeCard } from "@/components/ui/prime-card";

const testimonials = [
  {
    name: "Scott John",
    car: "Car: Nissan Leaf",
    quote:
      "The EVCS chargers are incredibly convenient and comforting for short-range EVs. The new chargers are easy to use with the app, reliable, and reasonably priced as well, making my overall experience awesome.",
  },
  {
    name: "Scott John",
    car: "Car: Nissan Leaf",
    quote:
      "The EVCS chargers are incredibly convenient and comforting for short-range EVs. The new chargers are easy to use with the app, reliable, and reasonably priced as well, making my overall experience awesome.",
  },
  {
    name: "Scott John",
    car: "Car: Nissan Leaf",
    quote:
      "The EVCS chargers are incredibly convenient and comforting for short-range EVs. The new chargers are easy to use with the app, reliable, and reasonably priced as well, making my overall experience awesome.",
  },
];

export function Testimonials() {
  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 text-foreground shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <Reveal>
        <h2 className="text-center text-3xl font-extrabold tracking-tight">
          Our customer loves
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Reveal key={`${item.name}-${index}`} delay={index * 0.08}>
            <PrimeCard className="rounded-3xl p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                &quot;{item.quote}&quot;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <Image
                  height={48}
                  width={48}
                  src="/images/clients/avatar.jpg"
                  alt={item.name}
                  className="h-12 w-12 rounded-full border border-border/70 object-cover"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.car}
                  </div>
                  <div className="mt-2 text-xs text-amber-500">★★★★★</div>
                </div>
              </div>
            </PrimeCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
