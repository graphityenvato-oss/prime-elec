import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto w-full max-w-7xl">
        <SiteNav />
        {children}
        <SiteFooter />
      </div>
    </main>
  );
}
