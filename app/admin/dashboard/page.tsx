"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";
import { PrimeCard } from "@/components/ui/prime-card";
import { supabaseClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      const { data } = await supabaseClient.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        router.replace("/ns-admin");
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.isAdmin) {
        router.replace("/ns-admin");
        return;
      }

      if (isMounted) {
        setChecked(true);
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!checked) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground lg:px-10">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
        <AdminSidebar />

        <div className="space-y-6">
          <section>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track orders, quotes, and inventory status in one place.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Open Quotes", value: "24" },
              { label: "Active Orders", value: "12" },
              { label: "Pending Approvals", value: "6" },
              { label: "Low Stock", value: "9" },
            ].map((item) => (
              <PrimeCard key={item.label} className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-3 text-2xl font-extrabold">{item.value}</p>
              </PrimeCard>
            ))}
          </section>

          <PrimeCard className="p-6">
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Quote #Q-1421 sent to EV Systems Co.</span>
                <span>2h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Order #A-0946 approved by procurement.</span>
                <span>5h ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Inventory alert: Breakers below threshold.</span>
                <span>Yesterday</span>
              </div>
            </div>
          </PrimeCard>
        </div>
      </div>
    </main>
  );
}
