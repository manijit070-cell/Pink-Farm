import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pink Farm — Premium Makhana & Everyday Favourites",
  description: "Discover thoughtfully selected everyday favourites, with Makhana at the heart of Pink Farm. Goodness That Feels Like Home.",
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingSocials } from "@/components/ui/FloatingSocials";
import { LuxuryScrollProgressBar } from "@/components/ui/MotionWrappers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-brand-ivory text-brand-charcoal">
        <LuxuryScrollProgressBar />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <FloatingSocials />
      </body>
    </html>
  );
}
