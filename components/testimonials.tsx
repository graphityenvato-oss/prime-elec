import { TestimonialsClient } from "@/components/testimonials-client";
import { supabaseServer } from "@/lib/supabase/server";

const fallbackTestimonials = {
  title: "Our customer loves",
  items: [
    {
      name: "Scott John",
      role: "Car: Nissan Leaf",
      quote:
        "The EVCS chargers are incredibly convenient and comforting for short-range EVs. The new chargers are easy to use with the app, reliable, and reasonably priced as well, making my overall experience awesome.",
      rating: 5,
    },
    {
      name: "Scott John",
      role: "Car: Nissan Leaf",
      quote:
        "The EVCS chargers are incredibly convenient and comforting for short-range EVs. The new chargers are easy to use with the app, reliable, and reasonably priced as well, making my overall experience awesome.",
      rating: 5,
    },
    {
      name: "Scott John",
      role: "Car: Nissan Leaf",
      quote:
        "The EVCS chargers are incredibly convenient and comforting for short-range EVs. The new chargers are easy to use with the app, reliable, and reasonably priced as well, making my overall experience awesome.",
      rating: 5,
    },
  ],
};

export async function Testimonials() {
  const { data: section } = await supabaseServer
    .from("home_testimonials_section")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: items } = await supabaseServer
    .from("home_testimonials")
    .select("*")
    .order("position", { ascending: true });

  const hasItems = (items?.length ?? 0) > 0;
  const content = hasItems
    ? {
        title: section?.title || fallbackTestimonials.title,
        items:
          items?.map((item) => ({
            name: item.name,
            role: item.role,
            quote: item.quote,
            rating: item.rating ?? 5,
          })) ?? fallbackTestimonials.items,
      }
    : fallbackTestimonials;

  return <TestimonialsClient title={content.title} items={content.items} />;
}
