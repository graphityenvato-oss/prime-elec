import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto w-full max-w-7xl px-6 pb-10">
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}
