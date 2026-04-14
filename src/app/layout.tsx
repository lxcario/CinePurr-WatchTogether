import type { Metadata, Viewport } from "next";
import Script from 'next/script';
import React from 'react';
import { VT323 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from '@/lib/i18n';
import { SkipToContent } from "@/components/Accessibility";
import { FullStructuredData } from "@/components/StructuredData";
import ClientRoot from "@/components/ClientRoot";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/security";
import { isMaintenanceMode } from "@/lib/maintenance";
import MaintenancePage from "@/app/maintenance/page";

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

// Get base URL for metadataBase
const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://cinepurr.me";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "CinePurr - Watch Movies & Videos Together with Friends",
    template: "%s | CinePurr"
  },
  description: "Watch movies and videos together in real-time with friends! Create rooms, chat, and enjoy perfectly synchronized playback with anyone, anywhere. 🐱🎬",
  keywords: ["watch together", "watch party", "sync video", "movie night", "streaming", "friends", "social"],
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

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXTAUTH_URL || "https://cinepurr.me",
    siteName: "CinePurr",
    title: "CinePurr - Watch Movies & Videos Together with Friends",
    description: "Watch movies and videos together in real-time with friends! Create rooms, chat, and enjoy perfectly synchronized playback with anyone, anywhere. 🐱🎬",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CinePurr - Watch Together",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "CinePurr - Watch Movies & Videos Together with Friends",
    description: "Watch movies and videos together in real-time with friends! Create rooms, chat, and enjoy perfectly synchronized playback. 🐱🎬",
    images: ["/og-image.png"],
    creator: "@cinepurr",
  },

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CinePurr",
  },

  // Additional meta
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
  } catch (e) {
    // Ignore errors for resilience
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
        {/* Preconnect for external APIs used later in the app */}
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://www.omdbapi.com" />

        {/* Preload critical resources for LCP - only resources that are definitely used */}
        {/* VT323 font preloading is handled by next/font/google - no manual preload needed */}
        {/* Preload default Pokemon sprite (LCP candidate on home page) */}
        <link rel="preload" href="/sprites/animated/25.gif" as="image" />

        {/* Manifest and icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />

        {/* Apple Web App meta */}
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
