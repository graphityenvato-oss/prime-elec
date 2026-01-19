"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminFab() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/admin/session-status")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setIsAdmin(Boolean(data?.isAdmin));
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAdmin(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin/dashboard"
      className="fixed bottom-6 right-6 z-50 rounded-full border border-border/60 bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_18px_40px_rgba(0,0,0,0.2)] transition-transform duration-200 hover:-translate-y-1"
    >
      Admin Dashboard
    </Link>
  );
}
