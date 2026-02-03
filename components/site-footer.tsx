import Image from "next/image";
import { SocialIcon } from "react-social-icons";

import { Reveal } from "@/components/reveal";

const columns = [
  {
    title: "Company",
    links: ["About Us", "Products", "Categories", "Brands"],
  },
  {
    title: "Resources",
    links: ["Prime News", "Customer Service", "FAQ", "Contact Us"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  },
];

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/PrimeElec.Lb" },
  { label: "Instagram", href: "https://www.instagram.com/prime_elec" },
  {
    label: "WhatsApp",
    href: "https://wa.me/96170971414?text=Hello%20Prime%20Elec%2C%20I%E2%80%99d%20like%20to%20inquire%20about%20product%20availability%20and%20pricing.",
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 rounded-[32px] border border-border/60 bg-linear-to-br from-muted/40 via-background to-background px-6 py-10 text-foreground shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Reveal className="flex items-center gap-3 text-sm font-semibold">
            <Image
              src="/images/logo/logo-original.svg"
              alt="Prime Elec"
              width={140}
              height={56}
              className="h-14 w-auto"
            />
          </Reveal>
          <Reveal>
            <p className="mt-4 max-w-md text-sm text-muted-foreground dark:text-accent-foreground">
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
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground dark:text-accent-foreground">
                {column.links.map((link) => {
                  const href =
                    link === "Home"
                      ? "/"
                      : link === "About Us"
                        ? "/about"
                        : link === "Products"
                          ? "/stock"
                          : link === "Categories"
                            ? "/categories"
                            : link === "Brands"
                              ? "/brands"
                              : link === "Blog"
                                ? "/blog"
                                : link === "Prime News"
                                  ? "/blog"
                                  : link === "Customer Service"
                                    ? "/contact"
                                    : link === "FAQ"
                                      ? "/faq"
                                      : link === "Contact Us"
                                        ? "/contact"
                                        : link === "Privacy Policy"
                                          ? "/privacy-policy"
                                          : link === "Terms of Service"
                                            ? "/terms-of-service"
                                            : link === "Cookie Policy"
                                              ? "/cookie-policy"
                                              : "#";
                  return (
                    <li key={link}>
                      <a className="hover:text-primary" href={href}>
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
        <span className="text-primary">Copyright © Prime Elec 2026</span>
        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <SocialIcon
              key={social.label}
              url={social.href}
              fgColor="currentColor"
              bgColor="transparent"
              style={{ height: 36, width: 36 }}
              className="rounded-full border border-border/70 text-foreground hover:bg-muted/30"
              target="_blank"
              rel="noopener noreferrer"
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
