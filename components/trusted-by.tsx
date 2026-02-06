import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { supabaseServer } from "@/lib/supabase/server";

const partners = [
  {
    name: "Degson",
    src: "/images/partners/degson-logo.png",
    href: "#",
  },
  {
    name: "Eaton",
    src: "/images/partners/Eaton-logo.png",
    href: "#",
  },
  {
    name: "Indelec",
    src: "/images/partners/Indelec-logo.png",
    href: "#",
  },
  {
    name: "Relpol",
    src: "/images/partners/Logo-Relpol.png",
    href: "#",
  },
  {
    name: "OBO",
    src: "/images/partners/obo-logo.png",
    href: "#",
  },
  {
    name: "Teknoware",
    src: "/images/partners/teknoware-logo.png",
    href: "#",
  },
  {
    name: "Tem",
    src: "/images/partners/Tem-logo.png",
    href: "#",
  },
];

const fallbackTitle = "Success Stories";

export async function TrustedBy() {
  const { data } = await supabaseServer
    .from("home_trusted_by")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const title = data?.title || fallbackTitle;
  const marqueePartners = [...partners, ...partners];

  return (
    <section className="mt-16 rounded-[32px] border border-border/60 bg-background px-6 py-12 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <Reveal>
        <h2 className="text-center text-2xl font-extrabold tracking-tight">
          {title}
        </h2>
      </Reveal>
      <div className="marquee mt-8">
        <div className="marquee-track items-center gap-10">
          {marqueePartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.href}
              aria-label={partner.name}
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
            >
              <Image
                height={200}
                width={200}
                src={partner.src}
                alt={partner.name}
                className="h-10 w-auto transition-opacity duration-200 hover:opacity-100 dark:invert dark:brightness-0 dark:contrast-200"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
