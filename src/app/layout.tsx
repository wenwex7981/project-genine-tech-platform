import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CartProvider } from "@/context/CartContext";
import { CountryProvider } from "@/context/CountryContext";
import { GoogleAnalytics } from '@next/third-parties/google';
import MonetizationWidgets from "@/components/MonetizationWidgets";

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
  title: {
    default: "Academic Projects, AI Resume Builder & Thesis Help for Students Worldwide [2026] — GraduateNex",
    template: "%s | GraduateNex",
  },
  description: "GraduateNex is the world's premier academic success platform — production-ready capstone projects, AI-powered ATS resume builders, thesis & dissertation help, and career tools for students in the US, UK, Canada, Australia, India, and 50+ countries.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    // Global keywords
    "capstone project help", "final year project source code", "thesis writing service", "dissertation help online",
    "ATS resume builder", "AI resume checker", "academic project marketplace", "plagiarism-free projects",
    "literature review writing", "research paper help", "IEEE format paper writing",
    // US-focused
    "capstone project help USA", "thesis writing service USA", "ATS resume builder United States",
    "MIT projects", "Stanford capstone", "Harvard dissertation help", "Georgia Tech projects",
    "UC Berkeley", "Carnegie Mellon", "University of Michigan", "Purdue University",
    // UK-focused
    "dissertation writing service UK", "final year project UK", "thesis help United Kingdom",
    "Oxford University", "Cambridge", "Imperial College London", "UCL projects", "University of Edinburgh",
    // Canada-focused
    "capstone project Canada", "thesis writing help Canada",
    "University of Toronto", "UBC", "McGill University", "University of Waterloo",
    // Australia-focused
    "thesis help Australia", "final year project Australia",
    "University of Melbourne", "UNSW", "ANU", "University of Sydney",
    // India-focused (retain existing)
    "Final year projects for CSE students", "BTech projects with source code", "MTech research projects",
    "JNTUH projects", "Anna University", "VTU", "VIT Vellore", "SRM University",
    // UAE & Middle East
    "thesis writing UAE", "capstone project Dubai", "academic help Abu Dhabi",
    // Singapore & Asia
    "NUS capstone project", "NTU Singapore", "academic project Singapore",
    // Germany & Europe
    "TU Munich projects", "RWTH Aachen", "thesis help Germany",
    // Services
    "AI content humanizer", "plagiarism checker", "ATS resume scorer", "hackathon directory",
    "GraduateNex", "academic success platform"
  ],
  authors: [{ name: "Appala Nithin" }],
  openGraph: {
    title: "GraduateNex | Global Academic & Career Success Platform",
    description: "Production-ready capstone projects, zero-plagiarism thesis & dissertation help, AI-powered resume builders, and career tools for students in 50+ countries.",
    url: "https://www.graduatenex.online",
    siteName: "GraduateNex",
    images: [{ url: "https://www.graduatenex.online/logo.png", width: 800, height: 800 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GraduateNex | Global Academic & Career Success Platform",
    description: "Production-ready capstone projects, thesis help, AI resume builders, and career tools for students worldwide.",
    images: ["https://www.graduatenex.online/logo.png"],
  },
  verification: {
    google: "6_tHEFyTHMeA_lWml1WH05XPgbSpiXIP6cJouAd5-OQ",
  }
};

import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const defaultCountry = headersList.get("x-user-country") || undefined;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground pb-20 md:pb-0 pt-10">
        <CountryProvider defaultCountry={defaultCountry}>
        <CartProvider>
          <MonetizationWidgets />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileBottomNav />
        </CartProvider>
        </CountryProvider>

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
                email: 'support@graduatenex.online',
                contactType: 'Customer Support',
                areaServed: ['US', 'GB', 'CA', 'AU', 'AE', 'SG', 'DE', 'IN', 'SA', 'FR'],
                availableLanguage: ['English']
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
        {/* AEO: AI Engine Optimization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              speakable: {
                '@type': 'SpeakableSpecification',
                cssSelector: ['h1', 'h2', '.prose', '[role="main"]']
              },
              mainEntity: {
                '@type': 'EducationalOrganization',
                name: 'GraduateNex',
                description: 'The world\'s premier Academic & Career Success Platform providing production-ready capstone projects, zero-plagiarism thesis & dissertation writing, AI-powered resume builders, hackathon discovery, and career launch tools for students in 50+ countries.',
                url: 'https://www.graduatenex.online',
                areaServed: [
                  { '@type': 'Country', name: 'United States' },
                  { '@type': 'Country', name: 'United Kingdom' },
                  { '@type': 'Country', name: 'Canada' },
                  { '@type': 'Country', name: 'Australia' },
                  { '@type': 'Country', name: 'India' },
                  { '@type': 'Country', name: 'United Arab Emirates' },
                  { '@type': 'Country', name: 'Singapore' },
                  { '@type': 'Country', name: 'Germany' },
                  { '@type': 'Country', name: 'Saudi Arabia' },
                  { '@type': 'Country', name: 'France' }
                ],
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: 'Academic & Career Services',
                  itemListElement: [
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Capstone & Final Year Projects', description: 'Production-ready capstone projects with complete source code in Python, Java, React, ML, AI, IoT, Blockchain for universities worldwide' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Thesis & Dissertation Writing', description: 'Expert thesis and dissertation help for Masters and PhD students with literature reviews, methodology design, and Turnitin-safe delivery in APA/MLA/Chicago/Harvard formats' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ATS Resume Builder', description: 'AI-powered ATS resume checker, JD matching analyzer, and resume generation for job seekers targeting top global companies' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Content Humanizer', description: 'Advanced AI text humanizer that transforms AI-generated content into natural, academic-quality writing that bypasses AI detection tools' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Research Paper Writing', description: 'IEEE-format research papers, project documentation, SRS documents, and abstracts with zero plagiarism guarantee' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interview Preparation', description: 'AI-generated interview prep guides for Google, Amazon, Microsoft, Meta, Goldman Sachs, McKinsey, and more' } }
                  ]
                }
              }
            })
          }}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
