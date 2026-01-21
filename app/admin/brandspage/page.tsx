"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { PrimeCard } from "@/components/ui/prime-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBrandsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
        <AdminSidebar />

        <div className="space-y-6">
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Brands Page
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Content manager
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organize brand sections and update what visitors see.
            </p>
          </section>

          <PrimeCard className="p-6">
            <Tabs defaultValue="intro">
              <TabsList>
                <TabsTrigger value="intro">Intro</TabsTrigger>
                <TabsTrigger value="catalog">Catalog CTA</TabsTrigger>
                <TabsTrigger value="brands">Brand Grid</TabsTrigger>
                <TabsTrigger value="quote-tip">Quote Tip</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="intro">
                <p className="mt-6 text-sm text-muted-foreground">
                  Intro editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="catalog">
                <p className="mt-6 text-sm text-muted-foreground">
                  Catalog CTA editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="brands">
                <p className="mt-6 text-sm text-muted-foreground">
                  Brand grid editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="quote-tip">
                <p className="mt-6 text-sm text-muted-foreground">
                  Quote tip editor will go here next.
                </p>
              </TabsContent>
              <TabsContent value="faq">
                <p className="mt-6 text-sm text-muted-foreground">
                  FAQ editor will go here next.
                </p>
              </TabsContent>
            </Tabs>
          </PrimeCard>
        </div>
      </div>
    </main>
  );
}
