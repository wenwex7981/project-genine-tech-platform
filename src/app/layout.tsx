import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: {
    default: "Final Year Projects with Source Code & Free ATS Resume Builder [2026] — GraduateNex",
    template: "%s | GraduateNex",
  },
  description: "GraduateNex provides premium, zero-plagiarism source code, research papers, and AI-powered document generation for Indian students and freshers to secure top jobs.",
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
                description: 'India\'s #1 Academic & Career Success Platform providing production-ready engineering projects, zero-plagiarism documentation, AI-powered resume builders, and hackathon discovery for Indian engineering students.',
                url: 'https://www.graduatenex.online',
                areaServed: {
                  '@type': 'Country',
                  name: 'India'
                },
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: 'Academic Services',
                  itemListElement: [
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Final Year Project Source Code', description: 'Production-ready BTech/MTech projects with complete source code in Java, Python, React, ML, AI, IoT, Blockchain' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ATS Resume Builder', description: 'Free ATS resume checker, JD matching analyzer, and AI-powered resume generation for Indian freshers' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interview Preparation', description: 'AI-generated interview prep guides for Deloitte, TCS, Infosys, Wipro, Google, Amazon and more' } },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Research Paper Writing', description: 'IEEE-format research papers, project documentation, and abstracts with zero plagiarism guarantee' } }
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
