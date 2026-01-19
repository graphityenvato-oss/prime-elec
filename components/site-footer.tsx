import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

import { Reveal } from "@/components/reveal";

const columns = [
  {
    title: "Company",
    links: ["Home", "About Us", "Product", "Site Hosts"],
  },
  {
    title: "Product",
    links: ["Careers", "EV Drivers", "How To Charge", "EV Charger Sales"],
  },
  {
    title: "Resources",
    links: ["Blog", "Customer Service", "Social Media", "Contact Us"],
  },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 text-foreground shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Reveal className="flex items-center gap-3 text-sm font-semibold">
            <Image
              src="/images/logo/prime-elec-logo.png"
              alt="Prime Elec"
              width={140}
              height={36}
              className="h-12 w-auto"
            />
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              The Engineer’s Choice precision-engineered components delivered
              with uncompromising accuracy, fast turnaround times, and
              consistent reliability you can depend on for every project.
            </p>
          </Reveal>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="hover:text-foreground" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
        <span>Copyright © EVCS2024</span>
        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground hover:bg-muted/30"
            >
              <social.icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
