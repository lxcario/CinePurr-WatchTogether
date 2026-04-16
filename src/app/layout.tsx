import type { Metadata, Viewport } from "next";
import React from "react";
import { VT323 } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import MaintenancePage from "@/app/maintenance/page";
import { SkipToContent } from "@/components/Accessibility";
import ClientRoot from "@/components/ClientRoot";
import { FullStructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";
import { authOptions } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { isMaintenanceMode } from "@/lib/maintenance";
import { isSuperAdmin } from "@/lib/security";

const pixelFont = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff69b4",
};

const baseUrl =
  process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://cinepurr.me";
const siteTitle = "CinePurr - Retro watch parties with chat, games, and study rooms";
const siteDescription =
  "CinePurr is a real-time watch-together platform with synchronized rooms, live chat, shared queues, minigames, gamification, and study tools.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteTitle,
    template: "%s | CinePurr",
  },
  description: siteDescription,
  keywords: [
    "watch together",
    "watch party",
    "sync video",
    "movie night",
    "streaming",
    "friends",
    "social",
  ],
  authors: [{ name: "CinePurr Team" }],
  creator: "CinePurr",
  publisher: "CinePurr",
  robots: "index, follow",
  alternates: {
    canonical: "https://cinepurr.me",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "CinePurr",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1920,
        height: 1080,
        alt: "CinePurr watch party preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.png"],
    creator: "@cinepurr",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CinePurr",
  },
  applicationName: "CinePurr",
  category: "entertainment",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let showMaintenance = false;

  try {
    const maintenanceActive = await isMaintenanceMode();
    if (maintenanceActive) {
      const session = await getServerSession(authOptions);
      if (!session?.user || !isSuperAdmin((session.user as any).role)) {
        showMaintenance = true;
      }
    }
  } catch {
    // Ignore maintenance checks on layout render failure to keep the app resilient.
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('cinepurr_intro_played')) {
                  document.documentElement.classList.add('skip-intro');
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://www.omdbapi.com" />

        {/* Preload the sprite most likely to appear in the home-page hero. */}
        <link rel="preload" href="/sprites/animated/25.gif" as="image" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={pixelFont.className} suppressHydrationWarning>
        <SkipToContent />
        <FullStructuredData />
        <ThemeProvider>
          <I18nProvider>
            <ClientRoot>
              <div id="main-content" tabIndex={-1}>
                {showMaintenance ? <MaintenancePage /> : children}
              </div>
            </ClientRoot>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
