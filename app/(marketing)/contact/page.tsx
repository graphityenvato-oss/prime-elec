"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MapPin, Phone, AlarmClock } from "lucide-react";
import { toast } from "sonner";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrimeCard } from "@/components/ui/prime-card";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Full name and email are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          company: company.trim() || null,
          email: email.trim(),
          phone: phone.trim() || null,
          partNumber: partNumber.trim() || null,
          quantity: quantity.trim() || null,
          details: details.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request.");
      }

      toast.success("Request submitted.");
      setFullName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setPartNumber("");
      setQuantity("");
      setDetails("");
    } catch {
      toast.error("Could not submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-10 sm:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Contact
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-primary">
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                    <Phone className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold">Contact details</h2>
                    <p className="text-xs text-muted-foreground">
                      Sales &amp; service lines
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-primary/70" />
                    <span>+961 70 97 14 14</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-primary/70" />
                    <span>info@prime-elec.co</span>
                  </div>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Response time
                </p>
                <p className="text-sm text-muted-foreground">
                  Within one business day
                </p>
              </div>
              <div className="w-fit rounded-2xl border border-border/60 bg-background/60 p-2 sm:shrink-0">
                <Image
                  src="/images/qr/prime-whatsapp-qr-code.png"
                  alt="Prime Elec WhatsApp QR code"
                  width={120}
                  height={120}
                  className="h-auto w-28 sm:w-32"
                />
              </div>
            </div>
          </PrimeCard>
          <PrimeCard className="p-6 lg:flex-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Office</h2>
                <p className="text-xs text-muted-foreground">
                  Logistics hub &amp; showroom
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Ghaziyeh</p>
            <p className="text-sm text-muted-foreground">Saida, Lebanon</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Receiving
            </p>
            <p className="text-sm text-muted-foreground">Gate A</p>
          </PrimeCard>
          <PrimeCard className="p-6 lg:flex-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
                <AlarmClock className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Hours</h2>
                <p className="text-xs text-muted-foreground">
                  Support &amp; dispatch
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Monday - Friday
            </p>
            <p className="text-sm text-muted-foreground">8:00 AM - 5:00 PM</p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Emergency
            </p>
            <p className="text-sm text-muted-foreground">24/7 dispatch</p>
          </PrimeCard>
        </div>

        <PrimeCard className="p-6 lg:h-full">
          <h2 className="text-lg font-semibold">Send a request</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us what you need and we&apos;ll follow up within one business
            day.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Full name</Label>
                <Input
                  id="contact-name"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-company">Company</Label>
                <Input
                  id="contact-company"
                  placeholder="Company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-part">Part number or link</Label>
              <Input
                id="contact-part"
                placeholder="Part number or link"
                value={partNumber}
                onChange={(event) => setPartNumber(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-qty">Estimated quantity</Label>
              <Input
                id="contact-qty"
                placeholder="e.g. 120 units"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-details">Project details</Label>
              <Textarea
                id="contact-details"
                className="min-h-35"
                placeholder="Tell us about your project..."
                value={details}
                onChange={(event) => setDetails(event.target.value)}
              />
            </div>
            <Button
              className="rounded-full bg-primary px-6"
              disabled={isSubmitting}
              type="submit"
            >
              Submit Request
            </Button>
          </form>
        </PrimeCard>
      </section>

      <PrimeCard className="mt-10 p-6">
        <h2 className="text-lg font-semibold">Visit us</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Find our logistics hub and showroom. Visitor parking is available
          on-site.
        </p>
        <div className="mt-4 h-72 overflow-hidden rounded-xl border border-border/60 bg-muted/20">
          <iframe
            title="PrimeElec location map"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3946.266384348692!2d35.36333967615992!3d33.50607244637149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ef13518dcc271%3A0xd8b405973d68829!2sPRIME%20ELEC!5e1!3m2!1sen!2slb!4v1770103386852!5m2!1sen!2slb"
          />
        </div>
      </PrimeCard>
    </>
  );
}
