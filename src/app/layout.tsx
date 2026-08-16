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
  metadataBase: new URL('https://www.graduatenex.online'),
  title: "GraduateNex | Premium Academic Projects & AI Career Tools in India",
  description: "GraduateNex provides premium, zero-plagiarism source code, research papers, and AI-powered document generation for Indian students and freshers to secure top jobs.",
  keywords: [
    "Final year projects for CSE students in India", "BTech projects with source code", "MTech research projects", 
    "Free ATS Resume Checker India", "Plagiarism removal service online", "AI Abstract maker", 
    "PPT maker for engineering projects", "Document generator", "Major project for CSE", "Mini project ideas", 
    "Job description resume matching", "GraduateNex", "Fresher resume builder",
    "JNTUH projects", "JNTUK", "JNTUA", "Anna University BTech projects", "VTU final year projects",
    "DU", "Delhi University", "Mumbai University", "SPPU Pune University", "Osmania University",
    "SRM University projects", "VIT Vellore", "Manipal University", "Amity", "LPU", "Chandigarh University",
    "AKTU projects", "UPTU", "GTU Gujarat", "RGPV Bhopal", "KTU Kerala", "MAKAUT", "BPUT", "Andhra University", "SVU",
    "IIT projects", "NIT final year projects", "IIIT", "BITS Pilani",
    "Andhra Pradesh", "Telangana", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi NCR", "Uttar Pradesh"
  ],
  authors: [{ name: "Appala Nithin" }],
  openGraph: {
    title: "GraduateNex | Academic & Career Success Platform in India",
    description: "Production-ready engineering projects, zero-plagiarism documentation, and AI-driven career tools to secure your dream job in India.",
    url: "https://www.graduatenex.online",
    siteName: "GraduateNex",
    images: [{ url: "https://www.graduatenex.online/logo.png", width: 800, height: 800 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GraduateNex | Academic & Career Success Platform",
    description: "Production-ready engineering projects, zero-plagiarism documentation, and AI-driven career tools for Indian students.",
    images: ["https://www.graduatenex.online/logo.png"],
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
        
        {/* Global Organization JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GraduateNex',
              url: 'https://www.graduatenex.online',
              logo: 'https://www.graduatenex.online/icon.png',
              sameAs: [
                'https://www.linkedin.com/company/graduatenex',
                'https://twitter.com/graduatenex'
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'projectgenie16@gmail.com',
                contactType: 'Customer Support',
                areaServed: 'IN',
                availableLanguage: ['English', 'Hindi', 'Telugu']
              }
            })
          }}
        />
        
        {/* WebSite SearchAction Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GraduateNex',
              url: 'https://www.graduatenex.online',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.graduatenex.online/projects?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  );
}
