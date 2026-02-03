import { Reveal } from "@/components/reveal";

const sections = [
  {
    title: "What are cookies?",
    body: [
      "Cookies are small text files stored on your device to help websites function and improve user experience.",
    ],
  },
  {
    title: "How we use cookies",
    body: [
      "We use essential cookies to enable core site functionality.",
      "We use analytics cookies to understand traffic and improve content.",
    ],
  },
  {
    title: "Cookie types",
    body: [
      "Essential: required for site functionality and security.",
      "Analytics: help us understand usage and improve performance.",
      "Preferences: remember basic choices such as language or region (if enabled).",
    ],
  },
  {
    title: "Managing cookies",
    body: [
      "You can control cookies through your browser settings.",
      "Disabling cookies may affect site functionality.",
    ],
  },
  {
    title: "Updates",
    body: [
      "We may update this Cookie Policy as we improve our services.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For cookie-related questions, please reach out via the Contact page.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Cookie Policy
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
            Cookie Policy.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Learn how Prime Elec uses cookies and how you can manage them.
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
