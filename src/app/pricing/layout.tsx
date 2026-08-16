import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans | GraduateNex Tech Platform",
  description: "Affordable tech solutions for students. Get unlimited access to AI tools, premium resumes, zero-plagiarism project codes, and VIP hackathon passes.",
  keywords: ["graduatenex pricing", "student tech subscriptions", "buy final year project online", "premium resume builder price", "hackathon access badge"],
  alternates: {
    canonical: "https://www.graduatenex.online/pricing",
  }
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GraduateNex Pricing',
    description: 'Pricing and subscription plans for GraduateNex services.',
    url: 'https://www.graduatenex.online/pricing',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'AI Helper Pro',
          price: '200',
          priceCurrency: 'INR',
          description: 'Unlimited access to AI abstract and PPT generation.'
        },
        {
          '@type': 'Offer',
          name: 'AI Plagiarism Removal Pro',
          price: '230',
          priceCurrency: 'INR',
          description: 'Bypass AI detectors and humanize text.'
        },
        {
          '@type': 'Offer',
          name: 'Resume Hub Pro',
          price: '500',
          priceCurrency: 'INR',
          description: 'Unlimited ATS checks and JD matching.'
        },
        {
          '@type': 'Offer',
          name: 'Hackathon VIP Pass',
          price: '500',
          priceCurrency: 'INR',
          description: 'Access to 15 exclusive hackathons.'
        }
      ]
    }
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
