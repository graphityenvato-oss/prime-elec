"use client";

import { CookieConsent } from "@/components/cookie-consent";

export function CookieConsentMount() {
  return (
    <CookieConsent
      variant="small"
      onAcceptCallback={() => console.log("Accepted")}
      onDeclineCallback={() => console.log("Declined")}
    />
  );
}
