import { Reveal } from "@/components/reveal";

const sections = [
  {
    title: "Overview",
    body: [
      "This Privacy Policy explains how Prime Elec collects, uses, and protects information when you visit our website or contact our team.",
      "By using our services, you agree to the practices described below.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "Contact details such as name, phone number, email address, and company information submitted through forms.",
      "Project details, files, and notes provided for quotation or technical support requests.",
      "Basic usage data such as pages visited and device/browser information for analytics.",
    ],
  },
  {
    title: "How we use your information",
    body: [
      "To respond to inquiries, prepare quotations, and provide technical support.",
      "To improve site performance, content, and customer experience.",
      "To comply with legal, regulatory, or contractual obligations.",
    ],
  },
  {
    title: "Data sharing",
    body: [
      "We do not sell personal information.",
      "We may share data with trusted service providers who support our operations (e.g., hosting, analytics) under confidentiality agreements.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We retain information only as long as necessary for operational, legal, or contractual purposes.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may request access, correction, or deletion of your personal data by contacting us.",
      "You can opt out of marketing communications at any time.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For privacy-related questions, please reach out via the Contact page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Privacy Policy
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
            Privacy Policy.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Learn how we collect, use, and safeguard your data across our
            services and website.
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
