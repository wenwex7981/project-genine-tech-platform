import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100+ Final Year BTech Projects with Source Code [2026] — Download Now",
  description: "Download production-ready final year projects for CSE, IT, ECE & EEE. Full source code, zero-plagiarism documentation, PPTs & research papers. ML, AI, Web Dev, IoT projects available.",
  keywords: ["final year projects cse", "btech projects download", "machine learning projects for final year", "react js projects with source code", "zero plagiarism project report", "major projects for cse", "final year project 2026"],
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'GraduateNex Academic Projects Catalog',
    description: 'A curated catalog of high-quality academic projects with full source code and documentation.',
    url: 'https://www.graduatenex.online/projects',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Machine Learning Final Year Projects',
          description: 'Ready-to-deploy ML projects with python source code and datasets.',
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: 'Full Stack Web Development Projects',
          description: 'MERN stack and Next.js complete projects with zero-plagiarism documentation.',
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
