import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Contact
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s build your next project together.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Share your project details, part numbers, or required specs. Our
            team will respond with pricing, availability, and engineering
            support.
          </p>
        </Reveal>
      </section>

      <section className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 lg:flex lg:h-full lg:flex-col lg:gap-4 lg:space-y-0">
          <PrimeCard className="p-6 lg:flex-1">
            <h2 className="text-lg font-semibold">Reach us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              +1 (000) 000-0000
            </p>
            <p className="text-sm text-muted-foreground">sales@primeelec.com</p>
          </PrimeCard>
          <PrimeCard className="p-6 lg:flex-1">
            <h2 className="text-lg font-semibold">Reach us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              +1 (000) 000-0000
            </p>
            <p className="text-sm text-muted-foreground">sales@primeelec.com</p>
          </PrimeCard>
          <PrimeCard className="p-6 lg:flex-1">
            <h2 className="text-lg font-semibold">Office</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              123 PrimeElec Way
            </p>
            <p className="text-sm text-muted-foreground">
              Dubai, United Arab Emirates
            </p>
          </PrimeCard>
          <PrimeCard className="p-6 lg:flex-1">
            <h2 className="text-lg font-semibold">Hours</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sunday - Thursday
            </p>
            <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
          </PrimeCard>
        </div>

        <PrimeCard className="p-6 lg:h-full">
          <h2 className="text-lg font-semibold">Send a request</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us what you need and we&apos;ll follow up within one business
            day.
          </p>
          <form className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Full name</Label>
                <Input id="contact-name" placeholder="Full name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-company">Company</Label>
                <Input id="contact-company" placeholder="Company" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="Email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input id="contact-phone" type="tel" placeholder="Phone" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-part">Part number or link</Label>
              <Input id="contact-part" placeholder="Part number or link" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-details">Project details</Label>
              <Textarea
                id="contact-details"
                className="min-h-35"
                placeholder="Tell us about your project..."
              />
            </div>
            <Button className="rounded-full bg-primary px-6">
              Submit Request
            </Button>
          </form>
        </PrimeCard>
      </section>

      <PrimeCard className="mt-10 p-6">
        <h2 className="text-lg font-semibold">Visit us</h2>
        <div className="mt-4 h-64 rounded-xl border border-border/60 bg-muted/20" />
      </PrimeCard>
    </>
  );
}
