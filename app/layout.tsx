import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { Toaster } from "@/components/ui/sonner";

const gilroyLight = localFont({
  src: "../public/fonts/Gilroy-Light.woff2",
  weight: "300",
  style: "normal",
  variable: "--font-gilroy-light",
  display: "swap",
});

const gilroyExtraBold = localFont({
  src: "../public/fonts/Gilroy-ExtraBold.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-gilroy-extrabold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime Elec",
  description: "Engineering-grade supply, project-ready stock, and technical support for industrial, commercial, and power sector builds.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gilroyLight.variable} ${gilroyExtraBold.variable} antialiased`}
      >
        <LenisProvider>
          {children}
          <Toaster position="top-right" />
        </LenisProvider>
      </body>
    </html>
  );
}
