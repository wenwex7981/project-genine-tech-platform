import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Tools for Students | Plagiarism Remover, Abstract & PPT Generator",
  description: "Free AI-powered tools for engineering students: Remove plagiarism to humanize text, generate research abstracts, create PPTs, and build UML diagrams instantly.",
  keywords: ["AI plagiarism remover free", "AI humanize text", "AI abstract generator", "AI PPT maker for projects", "UML diagram generator AI", "BTech project AI tools"],
  alternates: {
    canonical: "https://www.graduatenex.online/ai-services",
  }
};

export default function AIServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GraduateNex AI Student Suite',
    operatingSystem: 'Any',
    applicationCategory: 'UtilitiesApplication',
    description: 'A suite of AI tools designed to help students generate abstracts, create presentations, build UML diagrams, and humanize plagiarized text.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    url: 'https://www.graduatenex.online/ai-services'
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
