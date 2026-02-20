"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CookieIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type CookieConsentProps = {
  variant?: "default" | "small" | "minimal";
  mode?: boolean;
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
};

export function CookieConsent({
  variant = "default",
  mode = false,
  onAcceptCallback = () => {},
  onDeclineCallback = () => {},
}: CookieConsentProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasConsent = document.cookie.includes("cookieConsent=true");
    if (!hasConsent || mode) {
      setOpen(true);
    }
  }, [mode]);

  const accept = () => {
    document.cookie =
      "cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
    setOpen(false);
    onAcceptCallback();
  };

  const decline = () => {
    setOpen(false);
    onDeclineCallback();
  };

  const wrapperMaxWidth =
    variant === "minimal" ? "sm:max-w-[300px]" : "sm:max-w-md";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className={`fixed bottom-0 left-0 right-0 z-[200] w-full p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:p-0 ${wrapperMaxWidth}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {variant === "default" ? (
            <div className="rounded-lg border border-border bg-background shadow-lg sm:rounded-md dark:bg-card">
              <div className="grid gap-2">
                <div className="flex h-12 items-center justify-between border-b border-border p-3 sm:h-14 sm:p-4">
                  <h1 className="text-base font-medium sm:text-lg">
                    We use cookies
                  </h1>
                  <CookieIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
                </div>
                <div className="p-3 sm:p-4">
                  <p className="text-start text-xs font-normal text-muted-foreground sm:text-sm">
                    We use cookies to ensure you get the best experience on our
                    website. For more information on how we use cookies, please
                    see our cookie policy.{" "}
                    <Link href="/cookie-policy" className="underline">
                      Learn more
                    </Link>
                  </p>
                </div>
                <div className="grid grid-cols-2 items-center gap-2 border-t border-border p-3 dark:bg-background/20 sm:p-4 sm:py-5">
                  <Button
                    onClick={decline}
                    variant="outline"
                    className="w-full rounded-full"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={accept}
                    variant="default"
                    className="w-full rounded-full"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          ) : variant === "small" ? (
            <div className="m-0 rounded-lg border border-border bg-background shadow-lg dark:bg-card sm:m-3">
              <div className="flex items-center justify-between p-3">
                <h1 className="text-base font-medium sm:text-lg">
                  We use cookies
                </h1>
                <CookieIcon className="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]" />
              </div>
              <div className="p-3 -mt-2">
                <p className="text-left text-xs text-muted-foreground sm:text-sm">
                  We use cookies to ensure you get the best experience on our
                  website. For more information on how we use cookies, please see
                  our cookie policy.{" "}
                  <Link href="/cookie-policy" className="underline">
                    Learn more
                  </Link>
                </p>
              </div>
              <div className="mt-2 grid grid-cols-2 items-center gap-2 border-t p-3">
                <Button
                  onClick={decline}
                  className="w-full rounded-full"
                  variant="outline"
                >
                  Decline
                </Button>
                <Button onClick={accept} className="w-full rounded-full">
                  Accept
                </Button>
              </div>
            </div>
          ) : (
            <div className="m-0 rounded-lg border border-border bg-background shadow-lg dark:bg-card sm:m-3">
              <div className="flex items-center justify-between border-b border-border p-3">
                <div className="flex items-center gap-2">
                  <CookieIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs font-medium sm:text-sm">
                    Cookie Notice
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  We use cookies to enhance your browsing experience.
                </p>
                <div className="mt-3 grid grid-cols-2 items-center gap-2">
                  <Button
                    onClick={decline}
                    variant="ghost"
                    className="w-full rounded-full"
                  >
                    Decline
                  </Button>
                  <Button
                    onClick={accept}
                    variant="default"
                    className="w-full rounded-full"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
