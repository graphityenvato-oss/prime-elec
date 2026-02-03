import { Reveal } from "@/components/reveal";

const sections = [
  {
    title: "Acceptance of terms",
    body: [
      "By accessing or using the Prime Elec website and services, you agree to these Terms of Service.",
      "If you do not agree, please discontinue use of the site.",
    ],
  },
  {
    title: "Use of services",
    body: [
      "You may use our website to browse products, request quotations, and contact our team.",
      "You agree not to misuse the site, interfere with security, or attempt unauthorized access.",
    ],
  },
  {
    title: "Quotations and orders",
    body: [
      "All quotations are provided based on submitted requirements and are subject to availability.",
      "Final pricing and lead times are confirmed upon order placement.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "All content, branding, and materials on this site are owned by Prime Elec or its licensors.",
      "You may not reproduce, distribute, or modify content without written permission.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      "Prime Elec is not liable for indirect or consequential damages arising from use of the site.",
      "We do our best to keep information accurate but do not guarantee completeness.",
    ],
  },
  {
    title: "Changes to terms",
    body: [
      "We may update these terms from time to time. Continued use indicates acceptance of changes.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms, please reach out via the Contact page.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Terms of Service
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
            Terms of Service.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            These terms define how you can use our website, request quotations,
            and engage with Prime Elec services.
          </p>
        </Reveal>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
