"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

type LenisProviderProps = {
  children: React.ReactNode;
};

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });
    (window as { __lenis?: Lenis }).__lenis = lenis;

    const handleDialogState = () => {
      const openCount = Number(
        document.documentElement.dataset.dialogOpen ?? "0",
      );
      if (openCount > 0) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    handleDialogState();
    const observer = new MutationObserver(handleDialogState);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-dialog-open"],
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      delete (window as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
