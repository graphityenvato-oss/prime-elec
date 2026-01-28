import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-background px-6 py-10 text-foreground lg:px-10">
      <div className="grid w-full min-w-0 gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
        <AdminSidebar />
        <div className="min-w-0 space-y-6">{children}</div>
      </div>
    </main>
  );
}
