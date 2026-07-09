import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creator CRM Admin - Influencer Directory",
  description: "Manage influencer relationships, categories, follower counts, and engagement rates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 font-sans relative overflow-x-hidden">
        {/* Aurora Mesh Gradient Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[130px] opacity-70" />
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-500/8 blur-[120px] opacity-60" />
          <div className="absolute top-[40%] left-[25%] w-[45%] h-[45%] rounded-full bg-pink-500/5 blur-[120px] opacity-50" />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
