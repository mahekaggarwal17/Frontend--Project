import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "CreatorCRM — Influencer & Creator Management Dashboard",
  description: "Manage influencer relationships, categories, follower counts, and engagement rates. Full-featured creator CRM with real-time analytics.",
  keywords: ["creator management", "influencer CRM", "influencer directory", "engagement analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden">
        {/* Aurora Mesh Gradient Background */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a20_1px,transparent_1px),linear-gradient(to_bottom,#0f172a20_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-dvh">
          <Providers>
            <Header />
            {/* role=main + id for skip-link target (UI/UX Pro Max: skip-links, keyboard-nav) */}
            <main id="main-content" role="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
