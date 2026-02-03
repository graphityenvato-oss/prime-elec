import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can I request a quotation?",
    answer:
      "Use the Request for Quotation form on the Cart page or contact us directly via the Contact page. Share part numbers, quantities, and project timelines for the fastest response.",
  },
  {
    question: "Do you provide technical support and product selection?",
    answer:
      "Yes. Our engineering team can recommend suitable components, provide technical datasheets, and support system design based on your project requirements.",
  },
  {
    question: "What are your delivery lead times?",
    answer:
      "Lead times depend on availability and project scope. We keep key categories in stock for fast delivery, and will confirm timelines once the quote is requested.",
  },
  {
    question: "Can you handle bulk or project-based orders?",
    answer:
      "Absolutely. We support bulk procurement, phased delivery, and project-based supply for MEP and industrial customers.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We support regional and international shipping. Please contact us with your delivery destination for logistics options and costs.",
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            FAQ
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
            Frequently asked questions.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Quick answers about quotations, lead times, and technical support.
          </p>
        </Reveal>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
