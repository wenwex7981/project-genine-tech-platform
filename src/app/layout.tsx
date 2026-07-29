import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GraduateNex | Premium Academic Projects & AI Tools",
  description: "GraduateNex provides premium, zero-plagiarism source code, research papers, and AI-powered document generation for Indian students. Secure your dream job today.",
  keywords: [
    "Final year projects", "BTech projects", "MTech projects", "Source code", 
    "Resume ATS score checker", "Plagiarism removal", "Abstract maker", 
    "PPT maker", "Document generator", "Major project", "Mini project", 
    "Minor project", "Resume job description matching", "GraduateNex"
  ],
  authors: [{ name: "Appala Nithin" }],
  openGraph: {
    title: "GraduateNex | Academic Success Platform",
    description: "Production-ready projects, zero-plagiarism documentation, and AI-driven career tools to secure your dream job.",
    url: "https://graduatenex.online",
    siteName: "GraduateNex",
    images: [{ url: "https://graduatenex.online/logo.png", width: 800, height: 800 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GraduateNex | Academic Success Platform",
    description: "Production-ready projects, zero-plagiarism documentation, and AI-driven career tools.",
    images: ["https://graduatenex.online/logo.png"],
  },
  verification: {
    google: "6_tHEFyTHMeA_lWml1WH05XPgbSpiXIP6cJouAd5-OQ",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  );
}
