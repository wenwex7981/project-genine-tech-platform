import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Solutions & Services for Students | GraduateNex",
  description: "Explore GraduateNex services including custom web development, ML models, UI/UX design, and zero-plagiarism project creation for final year students.",
  keywords: ["custom final year projects", "web development for students", "machine learning freelance projects", "hire developer for btech project", "project report writing service"],
  alternates: {
    canonical: "https://www.graduatenex.online/services",
  }
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'GraduateNex Academic Tech Services',
    provider: {
      '@type': 'Organization',
      name: 'GraduateNex',
      url: 'https://www.graduatenex.online'
    },
    description: 'Custom academic project development, thesis assistance, and AI software solutions.',
    areaServed: 'IN',
    serviceType: 'Educational Tech Solutions'
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
