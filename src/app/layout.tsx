import type { Metadata } from "next";
import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

// Brand Guideline v1.0: Montserrat is the single brand typeface — used for both
// body copy and headings, so --font-body and --font-display share one variable.
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700", "800"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "SkipDial",
  description: "AI Call Agents for Inbound and Outbound Calls",
  metadataBase: new URL('https://www.skipdial.ai'),
  openGraph: {
    title: 'SkipDial',
    description: 'AI Call Agents for Inbound and Outbound Calls',
    url: 'https://www.skipdial.ai',
    siteName: 'SkipDial',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for OG image
        width: 1200,
        height: 630,
        alt: 'SkipDial',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkipDial',
    description: 'AI Call Agents for Inbound and Outbound Calls',
    images: ['/og-image.jpg'], // Placeholder for OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SkipDial",
              url: "https://www.skipdial.ai",
              logo: "https://www.skipdial.ai/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-480-868-1102",
                contactType: "customer service",
                areaServed: "US",
                availableLanguage: "en"
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "1801 E. Camelback Rd, Suite 201",
                addressLocality: "Phoenix",
                addressRegion: "AZ",
                postalCode: "85016",
                addressCountry: "US"
              }
            })
          }}
        />
      </head>
      {/* Base bg color lives on `body` in globals.css (opaque, not transparent),
          so no bg utility is needed here. */}
      <body suppressHydrationWarning className={`${montserrat.variable} ${jetbrainsMono.variable} font-body text-ink antialiased flex flex-col min-h-screen selection:bg-accent/20`}>
        <AuthProvider>
          <SmoothScroll />
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-bg focus:z-50 focus:text-accent focus:font-medium focus:border-b focus:border-r focus:border-line">
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
