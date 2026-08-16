import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Final Year Projects & Source Code for BTech | GraduateNex",
  description: "Download top-rated final year projects for CSE and IT. Get full source code, zero-plagiarism reports, and documentation for Machine Learning, Web Dev, and App Dev projects.",
  keywords: ["final year projects cse", "btech projects download", "machine learning projects for final year", "react js projects with source code", "zero plagiarism project report", "major projects for cse"],
  alternates: {
    canonical: "https://www.graduatenex.online/projects",
  }
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
